# HackZurich 2026 — Agent on a Leash (app)

React 19 · Vite · Tailwind v4 · **Untitled UI React v8 PRO**, kept in sync with the Untitled UI PRO v8 Figma file.

```bash
npm install
npm run dev            # http://localhost:5173
                       # living style guide: http://localhost:5173/design-system
npm run build
```

- **How design ↔ code sync works, setup, and gotchas:** [`design-system/README.md`](design-system/README.md)
- **Rules for Claude Code and the slash commands:** [`CLAUDE.md`](CLAUDE.md) · `.claude/commands/`
- **Figma variable → Tailwind class lookup:** [`design-system/tokens/TOKENS.md`](design-system/tokens/TOKENS.md)

| Slash command (Claude Code) | Use it when |
|---|---|
| `/figma-to-code <figma link>` | a screen or section is ready in Figma |
| `/sync-tokens` | variables changed in Figma (colors, radius, fonts) |
| `/restyle <direction>` | you want a new visual style across Figma and code |
| `/code-to-figma <component>` | a developer added or changed a component |
| `/check-sync` | before a demo or handoff, to confirm nothing has drifted |
