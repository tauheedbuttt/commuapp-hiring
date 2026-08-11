# mobile coding standards

Conventions for this app, beyond what `mobile/README.md` documents about
structure. Applies to all new mobile code, not just the onboarding screen it
was written for.

## Types live in `src/types/`

Every type/interface definition lives under `src/types/`, one file per
module/feature (`navigation.ts`, `location.ts`, `components.ts`, `screens.ts`,
...), re-exported from `src/types/index.ts`. No `type`/`interface`
declarations anywhere else in the codebase — components, screens, stores, and
hooks import what they need from `../types` (or `../../types`) instead of
declaring their own `Props` type inline.

Exception: generated code (`src/api/generated/`) is exempt — it's not
hand-written, and its types are already centralized by codegen itself.

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
