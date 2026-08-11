# mobile coding standards

Conventions for this app, beyond what `mobile/README.md` documents about
structure. Applies to all new mobile code, not just the onboarding screen it
was written for.

## `src/types/` is for shared domain types only

Types that describe a concept used across multiple files — a route param list
(`navigation.ts`), a domain entity like `Location` (`location.ts`) — live
under `src/types/`, one file per concept, re-exported from
`src/types/index.ts`.

Props types do **not** go there. A component or screen's `Props` (or
`<Name>UIProps`) is declared inline, right in that file, next to the
component that uses it — it's not a shared concept, so it doesn't need a
shared home. Same for any other type that's only ever used in one file (e.g.
`OnboardingScreen`'s local `GpsCoords`).

Exception: generated code (`src/api/generated/`) is exempt either way — it's
not hand-written, and its types are already centralized by codegen itself.

## Screens vs. components split

- `screens/<Name>/<Name>Screen.tsx` — owns state, validation, Apollo calls,
  and navigation triggers. No JSX beyond rendering its paired UI component.
- `screens/<Name>/<Name>UI.tsx` — the actual presentational JSX for that
  screen, colocated in the same folder, receiving everything it needs via
  props (values, handlers, loading/error flags) rather than reading
  state/stores/Apollo itself. Colocated `<Name>UI.styles.ts`.

This mirrors the app-wide `components/` split below at the screen level: one
file that knows *how to get the data*, one that knows *how to render it*.

## `components/` — shared, presentational only

Renamed from the earlier `ui/`. Each component gets its own folder with a
colocated `*.styles.ts`. No state beyond local UI-only state (a modal's
open/closed flag, a search query) and no API calls.

## Prefer one configurable component over near-duplicate variants

Don't build `PrimaryButton` next to `OutlineButton`, or a `CountryPicker`
next to a future `CityPicker` — build one `Button` with a `variant` prop, one
`Picker` that takes `options`/`value`/`onChange` via props and has no
knowledge of what domain it's picking from. Domain-specific data (e.g. the
country name list) lives in `data/`, passed in as a prop by the screen that
needs it.
