# mobile

Expo (React Native, TypeScript) app. Blank Expo template as the base, no dev
client / bare workflow needed — runs via Expo Go or an emulator.

Screens:

- **Onboarding** — asks for home city/country (manually typed or via device
  GPS), resolves it to coordinates through the backend's `geocodeTown` query,
  and persists the result on-device. Navigates to Home on success.
- **Home** — nearby notices list with a collapsible area summary on top,
  fetched from the backend.
- **NoticeDetail** — full detail view for a single notice.
- **Settings** — view/change the saved home location, clear it to return to
  onboarding.

## Setup

```bash
npm install
```

No `.env` — the backend GraphQL URL is derived at runtime in
`src/api/client.ts` from Expo's dev-server host (see Notes below), not an
env var. There's nothing else this app currently needs to configure
per-environment.

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
- `types/` — shared domain types only (route params, entities like
  `Location`), one file per concept, re-exported from `types/index.ts`.
  Props types stay inline in the component/screen file that uses them.
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
for hydration (`hooks/useHasHydrated.ts`), then skips straight to Home if a
location is already saved — onboarding is skipped whenever a saved location
exists, and can reappear after Settings clears it.

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
- **Backend URL**: derived in `src/api/client.ts` from
  `Constants.expoConfig.hostUri` — the LAN IP Metro is bound to, i.e. the same
  IP the device already used to load the JS bundle. `localhost` only resolves
  to the backend on the iOS simulator (shares the Mac's network namespace);
  Android emulators and physical devices are separate machines on the
  network and need the real LAN IP instead. That LAN IP is only reachable if
  the backend was started with `php artisan serve --host=0.0.0.0` — the
  default (`127.0.0.1`) rejects connections from anything but the backend's
  own machine, which silently hangs every request from a phone/emulator (see
  root README).
- **Errors surfaced on-screen**: `geocodeTown`'s `extensions.category` —
  `not_found` and `upstream` map to distinct messages; GPS permission denial
  and reverse-geocode failure (no address for the coordinates) each get their
  own message with a nudge back to manual entry.
- **Home screen** fetches nearby notices and an area summary from the backend,
  keyed on the persisted location and the search distance set in Settings.
- No automated tests, per this repo's testing policy. Verification is manual
  (Expo Go / emulator) against the golden paths and error cases listed in the
  originating issue — **not yet run**, since this screen was built in an
  environment without an emulator/device attached. Run it before merging.
