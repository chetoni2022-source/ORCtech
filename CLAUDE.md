# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

ORCtech is a **browser-loaded React prototype** for a Brazilian SMB platform with two modules: **Loja** (retail/sales) and **Orça** (service quotes/agenda). All source is `.jsx` compiled in-browser by `@babel/standalone`. There is **no build step, no package manager, no test suite, no bundler** — just `ORCtech.html` loading pinned UMD scripts from unpkg.

## Running it

Open `ORCtech.html` directly in a browser, or serve the directory statically (any of: `python -m http.server`, `npx serve`, etc.). Babel transpiles each `<script type="text/babel">` on load — expect a noticeable first-paint delay and console warnings about in-browser Babel; that's expected.

There are no commands to build, lint, typecheck, or test.

## Architecture

### Script loading order is load-bearing

`ORCtech.html` loads files in a fixed order (foundation → components → pages → app). Each file defines top-level functions/consts and explicitly exports them by assigning to `window` at the bottom:

```js
Object.assign(window, { Sidebar, TopBar, ModuleSwitcher, ... });
```

There are **no imports/exports** — every component, helper, and dataset is a global. When adding a new component, you must (1) define it at file scope, (2) append it to that file's `Object.assign(window, …)`, and (3) ensure it's loaded *after* anything it depends on (check `ORCtech.html` script order: `tweaks-panel → icons → data → ui → layout → pages-* → features → app`).

### Dual-viewport stage (`app.jsx`)

The root render is **not** the app itself — it's `ORCtechStage`, which mounts **two independent `AppInstance`s side-by-side**: a desktop frame (`DeviceFrame`, 1280×820) and a mobile frame (`PhoneFrame`, 390×820). Each `AppInstance` has its own React state (route, auth, module, etc.), so navigating in one viewport doesn't affect the other. The `isMobile` prop is what every page branches on for responsive behavior — there are no CSS media queries for layout.

### Tweaks panel & host protocol

`tweaks-panel.jsx` is a reusable shell used here for theme/density/plan/viewport switches. It speaks a `postMessage` protocol with a hypothetical parent host:

- Posts `__edit_mode_available` on mount, `__edit_mode_dismissed` on close, `__edit_mode_set_keys` on every tweak change.
- Listens for `__activate_edit_mode` / `__deactivate_edit_mode`.
- The tweak defaults block in `app.jsx` is wrapped in `/*EDITMODE-BEGIN*/…/*EDITMODE-END*/` markers — the host rewrites this JSON in-place to persist values. **Preserve these comment markers exactly** when editing the defaults.

When running standalone in a browser (no host), the protocol messages are harmless no-ops; state lives in React only and resets on reload.

### Module/route model

Routes are plain string keys like `"loja/dashboard"`, `"orca/orcamentos"`, `"clientes/c_201"`. State lives in `AppInstance` (`route`, `module`); `navigate(to)` updates both and resolves the module from the route prefix. Pages are dispatched by a `switch` in `app.jsx` — to add a page, add a case there and create the component in the relevant `pages-*.jsx` file.

The `plan` tweak (`combo` / `loja` / `orca`) gates module access; locked modules render `BlockedModule` instead of the page. Keep that gate in mind when adding cross-module navigation.

### Files

- `tokens.css` — design tokens (CSS variables). `.theme-dark` and `.density-{compact,default,comfy}` are toggled on `app-root` from `ORCtechStage` tweaks. Use existing tokens (`var(--tech)`, `var(--bg-elev)`, `var(--text-muted)`, etc.) instead of hardcoded colors.
- `icons.jsx` — `I.IconName` object of inline SVGs (Lucide-style, 24-viewBox, stroke 1.75). Add new icons to the `I` object rather than inlining SVGs in pages.
- `data.jsx` — all mock data (`PRODUCTS`, `CUSTOMERS`, `ORCAMENTOS`, etc.) plus `fmtBRL` / `fmtInt` formatters. Pure pt-BR Brazilian market data; preserve realism (BRL prices, BR phone formats, real city/state pairs) when adding records.
- `ui.jsx` — primitive components (`Button`, `Badge`, `Avatar`, `Modal`, `Drawer`, `Toast`, `Sparkline`, `Donut`, `MiniBars`, `SectionHead`) and the `statusTone()` helper that maps Portuguese status strings (`"Pago"`, `"Aprovado"`, `"Aguardando"`…) to semantic tones.
- `layout.jsx` — `Sidebar`, `TopBar`, `MobileTabBar`, `ModuleSwitcher`, `MobileMenu`. Nav config is the `NAV_LOJA` / `NAV_ORCA` arrays at the top.
- `pages-loja.jsx`, `pages-orca.jsx`, `pages-shared.jsx`, `pages-analises.jsx`, `pages-flows.jsx` — page components grouped by module/concern.
- `features.jsx` — cross-cutting overlays: `CommandPalette` (Cmd+K, wired in `app.jsx`), `AIAssistant`, `MobileFAB`, `ConfirmDialog`, `CustomerDetail`, `EmptyState`. `PAGES_INDEX` and `QUICK_ACTIONS` here power the palette — keep them in sync when adding routes.

### Conventions

- All user-facing copy is **pt-BR**. Keep it that way; don't translate to English.
- Brand styling: never use channel brand colors (Shopee/ML/TikTok) — render them as neutral `<ChannelPill>` per brandbook.
- Modal/Drawer/Toast overlays are positioned `absolute` relative to `.app-root`, not the document — they're scoped to one viewport frame, which matters for the dual-viewport stage.
- Mobile FAB action is route-specific; the mapping lives in `app.jsx` near the bottom of `AppInstance`.
