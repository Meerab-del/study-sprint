# Study Sprint — Focus Session Tracker

Web Dev Stretch Task submission. Rebuilds the provided reference mock as a
production-quality, responsive React + TypeScript page.

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Build for deploy

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to Vercel / Netlify, or run `vercel` / `netlify deploy`
directly from this folder.

## Component structure

- `src/App.tsx` — page layout and all state (timer, theme, log, sync).
- `src/components/Button.tsx` — reusable button with `primary` / `ghost` /
  `danger` variants, `sm` / `md` / `lg` sizes, and a `loading` state.
- `src/components/FlapDigit.tsx` + `TimerBoard.tsx` — the split-flap timer
  display, built from a single reusable digit tile.
- `src/components/StatBadge.tsx` — small stat tile with 3 color tones.
- `src/components/LogRow.tsx` — one row in the session log, styled by status.
- `src/components/ThemeToggle.tsx` — light/dark toggle, drives `data-theme`
  on the root element.
- `src/types.ts` — shared TypeScript types for all of the above.
- `src/styles/tokens.css` — all color tokens as CSS variables (light + dark),
  plus a `prefers-reduced-motion` override. No hardcoded hex values appear
  anywhere in component code — every color reads from a `var(--token)`.

## States covered

- **Hover** — buttons brighten and lift slightly; theme toggle uses
  `active:scale-95` for press feedback.
- **Focus** — global `:focus-visible` outline using the teal token, visible
  on every interactive element (buttons, toggle, duration chips).
- **Active** — duration chips use `aria-pressed`; buttons scale down on
  press.
- **Disabled** — duration chips disable while a sprint is running; Reset
  disables when there's nothing to reset.
- **Loading** — "Save to log" shows a spinner and disables itself while
  syncing.
- **Error** — a 30% simulated failure on save shows a `role="alert"` banner
  with recovery guidance, without losing the elapsed time.

## Responsive behavior

- Mobile (`< 640px`): single column, stats rail and log stack full-width
  below the timer card, progress bar hidden to keep the header uncluttered.
- Tablet (`sm: ≥ 640px`): progress bar appears, spacing opens up, timer
  tiles grow via `clamp()`.
- Desktop (`lg: ≥ 1024px`): two-column grid — timer card (1.3fr) beside the
  stats rail (1fr) — real reflow via `grid-cols-[1.3fr_1fr]`, not just a
  scaled-up mobile layout.

## Accessibility notes

- Timer uses `role="timer"` with `aria-live="polite"` and a plain-language
  `aria-label` (screen readers announce time remaining, not raw digits).
- Duration selector is a `role="group"` with `aria-pressed` per option.
- Theme toggle exposes `aria-pressed` + `aria-label`.
- Error banner uses `role="alert"` so it's announced immediately.
- All interactive elements have a visible focus ring
  (`:focus-visible`, 2px, offset).
- Color pairs (text on background) were chosen from the token set to meet
  WCAG AA contrast in both themes.
- Respects `prefers-reduced-motion` — transitions and the spinner collapse
  to near-instant for users who've asked for reduced motion.

## Live deployment

**https://study-sprint-tau.vercel.app**

Repo: https://github.com/Meerab-del/study-sprint

## Lighthouse accessibility report

**Score: 100/100** — audited directly against the deployed Vercel URL from
Chrome DevTools (Lighthouse panel). Screenshot: `lighthouse-accessibility-report.jpeg`
(included in this submission).

To re-run it yourself:

```bash
npm run build && npm run preview
npx lighthouse http://localhost:4173 --only-categories=accessibility --view
```

or run it directly against the live URL:

```bash
npx lighthouse https://study-sprint-tau.vercel.app --only-categories=accessibility --view
```

## Ambiguity calls made from the mock

- The mock didn't specify what happens if you switch duration mid-sprint —
  disabled the duration chips entirely while `running` is true, so you must
  pause first.
- "Loading" state was only implied for the save action; applied the same
  spinner + disabled pattern to any future async button via the `Button`
  component's `loading` prop, so it's reusable, not one-off.
