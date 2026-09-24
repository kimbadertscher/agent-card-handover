import type { Dispatch } from "react";
import { useEffect, useState } from "react";
import { api, dataMode } from "@/features/shopping-card/api/client";
import type { Action } from "@/features/shopping-card/prototype-state";

/**
 * Live mode only (VITE_API_BASE set): loads the feed once, then turns Server-Sent Events into reducer actions.
 * Mock mode: does nothing, the demo controls dispatch the same `INGEST` action.
 */
export const useLiveFeed = (dispatch: Dispatch<Action>) => {
    const [status, setStatus] = useState<"mock" | "connecting" | "live" | "offline">(dataMode === "live" ? "connecting" : "mock");

    useEffect(() => {
        if (dataMode !== "live") return;
        let cancelled = false;

        api.feed()
            .then((feed) => {
                if (cancelled) return;
                [...feed.decisions].reverse().forEach((d) => dispatch({ type: "INGEST", decision: d, quiet: true }));
                feed.asks.forEach((d) => dispatch({ type: "INGEST", decision: d, quiet: true }));
                setStatus("live");
                dispatch({ type: "PATCH", patch: { offline: false } });
            })
            .catch(() => {
                setStatus("offline");
                dispatch({ type: "PATCH", patch: { offline: true } });
            });

        const stop = api.stream(
            (e) => {
                switch (e.type) {
                    case "decision":
                        dispatch({ type: "INGEST", decision: e.decision });
                        break;
                    case "ask":
                        dispatch({ type: "INGEST", decision: e.decision });
                        break;
                    case "ask_expired":
                        dispatch({ type: "TIME_UP" });
                        break;
                    case "leash_changed":
                        dispatch({ type: "PATCH", patch: { rules: e.leash.rules, smart: e.leash.smart, monthSpent: e.leash.month_spent_chf, frozen: e.leash.status === "paused" } });
                        break;
                }
                setStatus("live");
            },
            () => {
                setStatus("offline");
                dispatch({ type: "PATCH", patch: { offline: true } });
            },
        );

        return () => {
            cancelled = true;
            stop();
        };
    }, [dispatch]);

    return status;
};
