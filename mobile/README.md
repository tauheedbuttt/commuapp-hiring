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

Layer-based, mirroring the backend's organize-by-responsibility convention:

- `screens/` — screen components; own state, validation, Apollo calls, and
  navigation triggers (`screens/Onboarding/`, `screens/Home/`)
- `navigation/` — React Navigation (native-stack) setup and route types
- `api/` — Apollo Client instance, `.graphql` operation documents under
  `api/operations/`, GraphQL Code Generator output under `api/generated/`
  (committed, not gitignored — mirrors the backend's committed Sailor client)
- `store/` — Zustand store(s)
- `hooks/` — reusable hooks that read/derive from stores or native APIs
- `ui/` — presentational-only components (no state/API calls beyond local UI
  state like a modal's open/closed flag), each with a colocated
  `*.styles.ts` file
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
  only); the picker UI itself (`ui/CountryPicker`) is a custom
  modal + search list, not a bundled picker component, to stay visually
  consistent with the rest of the screen. Defaults to `Finland` — commu is a
  Finnish product.
- **Backend URL**: hardcoded per-platform in `src/api/client.ts`, since
  Android emulators resolve `localhost` to the emulator itself rather than the
  host machine (`10.0.2.2` is the documented alias for the host loopback).
- **Errors surfaced on-screen**: `geocodeTown`'s `extensions.category` —
  `not_found` and `upstream` map to distinct messages; GPS permission denial
  and reverse-geocode failure (no address for the coordinates) each get their
  own message with a nudge back to manual entry.
- No automated tests, per this repo's testing policy. Verification is manual
  (Expo Go / emulator) against the golden paths and error cases listed in the
  originating issue — **not yet run**, since this screen was built in an
  environment without an emulator/device attached. Run it before merging.
