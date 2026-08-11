# mobile

Expo (React Native, TypeScript) app. Blank Expo template as the base, no dev
client / bare workflow needed — runs via Expo Go or an emulator.

One screen so far:

- **Onboarding** — asks for home city/country (manually typed or via device
  GPS), resolves it to coordinates through the backend's `geocodeTown` query,
  and persists the result on-device. Navigates to a placeholder Home screen
  on success.

## Setup

```bash
npm install
```

No `.env` — the backend GraphQL URL is a hardcoded local dev URL in
`src/api/client.ts` (Android emulator vs. everything else, see Notes below).
There's nothing else this app currently needs to configure per-environment.

## Run

Requires the backend running locally (`cd ../backend && php artisan serve`,
listening on `127.0.0.1:8000`).

```bash
npm start
```

Then either scan the QR code with Expo Go, or:

```bash
npm run android   # Android emulator/device
npm run ios       # iOS simulator
```

## Structure

Layer-based, mirroring the backend's organize-by-responsibility convention.
See `docs/STANDARDS.md` for the reasoning behind the screens/UI split, the
components rules, and the types rule below — this section is just the map.

- `screens/<Name>/` — `<Name>Screen.tsx` owns state, validation, Apollo
  calls, and navigation triggers; `<Name>UI.tsx` is the presentational half,
  receiving everything via props (`screens/Onboarding/`, `screens/Home/`)
- `navigation/` — React Navigation (native-stack) setup
- `api/` — Apollo Client instance, `.graphql` operation documents under
  `api/operations/`, GraphQL Code Generator output under `api/generated/`
  (committed, not gitignored — mirrors the backend's committed Sailor client)
- `store/` — Zustand store(s)
- `hooks/` — reusable hooks that read/derive from stores or native APIs
- `components/` — shared, presentational-only components (no state/API calls
  beyond local UI-only state like a modal's open/closed flag), each with a
  colocated `*.styles.ts` file
- `types/` — every type/interface in the app, one file per module/feature,
  re-exported from `types/index.ts`; nothing declares its own inline type
  elsewhere (generated codegen output is exempt)
- `theme/` — colors, sampled from the reference screenshot
- `data/` — small static datasets (country name list)

`App.tsx` is a thin shell: `ApolloProvider` → `SafeAreaProvider` →
`NavigationContainer` → `RootNavigator`.

## Codegen

`geocodeTown`'s typed hook is generated from the backend's
`backend/graphql/schema.graphql` plus `src/api/operations/*.graphql`:

```bash
npm run codegen
```

Re-run after editing an operation file or after the backend schema changes.

## Location persistence

`store/locationStore.ts` holds `{ city, country, latitude, longitude }` behind
Zustand's `persist` middleware, backed by AsyncStorage. `RootNavigator` waits
for hydration (`hooks/useLocationHasHydrated.ts`), then skips straight to Home
if a location is already saved — onboarding only ever runs once per install.

## Notes

- **Manual entry**: City + Country are concatenated as `"City, Country"` and
  sent as `geocodeTown(town: ...)`.
- **GPS entry**: `expo-location` requests foreground permission, reads
  coordinates, then resolves them to city/country via its `reverseGeocodeAsync`
  — the device OS geocoder, no network call. Submitting this path stores the
  already-known coordinates directly and skips `geocodeTown` entirely. Editing
  City or Country after a GPS fill reverts to the manual (geocoded) path, since
  the edited text is no longer guaranteed to match the GPS coordinates.
- **Country list**: names come from the `world-countries` npm package (data
  only); the picker UI itself (`components/Picker`) is a generic, custom
  modal + search list — no domain knowledge of countries, just
  `label`/`value`/`options`/`onChange` — not a bundled picker component, to
  stay visually consistent with the rest of the screen. Onboarding passes it
  the country list and defaults to `Finland` — commu is a Finnish product.
- **Backend URL**: hardcoded per-platform in `src/api/client.ts`, since
  Android emulators resolve `localhost` to the emulator itself rather than the
  host machine (`10.0.2.2` is the documented alias for the host loopback).
- **Errors surfaced on-screen**: `geocodeTown`'s `extensions.category` —
  `not_found` and `upstream` map to distinct messages; GPS permission denial
  and reverse-geocode failure (no address for the coordinates) each get their
  own message with a nudge back to manual entry.
- **Home screen** currently dumps the persisted location as raw JSON
  (`screens/Home/HomeUI.tsx`) — a temporary stand-in so the onboarding →
  persistence flow is visible end-to-end before the real Home content (post
  list, area summary) exists. Remove once that lands.
- No automated tests, per this repo's testing policy. Verification is manual
  (Expo Go / emulator) against the golden paths and error cases listed in the
  originating issue — **not yet run**, since this screen was built in an
  environment without an emulator/device attached. Run it before merging.
