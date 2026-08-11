# mobile

Expo (React Native, TypeScript) app. Built on the blank Expo template. No dev client, no bare workflow. Runs via Expo Go or an emulator.

Screens:

- **Onboarding**: asks for home city/country (typed by hand or pulled from device GPS). Resolves it to coordinates through the backend's `geocodeTown` query. Saves the result on-device. Goes to Home on success.
- **Home**: nearby notices list, with a collapsible area summary on top. Data comes from the backend.
- **NoticeDetail**: full detail view for one notice.
- **Settings**: view or change the saved home location. Clear it to go back to onboarding.

## Setup

```bash
npm install
```

No `.env` file needed for normal dev. The backend GraphQL URL is worked out at runtime in `src/api/client.ts`, from Expo's dev-server host (see Notes below).

Only exception: if there's no Metro dev-server host to derive it from (standalone build, no dev server), set `EXPO_PUBLIC_BACKEND_GRAPHQL_URL` yourself. No default value ships for it, per this repo's env var policy. Missing it in that case throws at startup.

## Run

Needs the backend running locally first:

```bash
cd ../backend && php artisan serve
```

That listens on `127.0.0.1:8000`.

Then start the app:

```bash
npm start
```

Scan the QR code with Expo Go, or run one of these:

```bash
npm run android   # Android emulator/device
npm run ios       # iOS simulator
```

## Structure

Layer-based, matching the backend's organize-by-responsibility setup. See `docs/STANDARDS.md` for the reasoning behind the screens/UI split, the component rules, and the types rule below. This section is just the map.

- `screens/<Name>/`: `<Name>Screen.tsx` owns state, validation, Apollo calls, and navigation. `<Name>UI.tsx` is the presentational half, gets everything through props (see `screens/Onboarding/`, `screens/Home/`)
- `navigation/`: React Navigation (native-stack) setup
- `api/`: Apollo Client instance, `.graphql` operation files under `api/operations/`, GraphQL Code Generator output under `api/generated/` (committed, not gitignored, same as the backend's committed Sailor client)
- `store/`: Zustand store(s)
- `hooks/`: reusable hooks that read or derive from stores or native APIs
- `components/`: shared, presentational-only components (no state or API calls, aside from local UI-only state like a modal's open/closed flag). Each has a colocated `*.styles.ts` file
- `types/`: shared domain types only (route params, entities like `Location`). One file per concept, re-exported from `types/index.ts`. Props types stay inline in the component/screen file that uses them
- `theme/`: colors, sampled from the reference screenshot
- `data/`: small static datasets (country name list)

`App.tsx` is a thin shell: `ApolloProvider` → `SafeAreaProvider` → `NavigationContainer` → `RootNavigator`.

## Codegen

`geocodeTown`'s typed hook is generated from two sources: the backend's `backend/graphql/schema.graphql`, and `src/api/operations/*.graphql`.

```bash
npm run codegen
```

Re-run this after editing an operation file, or after the backend schema changes.

## Location persistence

`store/locationStore.ts` holds `{ city, country, latitude, longitude }`, kept behind Zustand's `persist` middleware and backed by AsyncStorage.

- `RootNavigator` waits for hydration (`hooks/useHasHydrated.ts`)
- if a location is already saved, it skips straight to Home
- onboarding only shows up when there's no saved location, or after Settings clears it

## Notes

- **Manual entry**
  - City and Country get joined as `"City, Country"`
  - sent as `geocodeTown(town: ...)`
- **GPS entry**
  - `expo-location` asks for foreground permission, reads coordinates
  - resolves them to city/country with `reverseGeocodeAsync` (device OS geocoder, no network call)
  - submitting this path saves the already-known coordinates directly, skips `geocodeTown` entirely
  - editing City or Country after a GPS fill switches back to the manual (geocoded) path, since the edited text can't be trusted to match the GPS coordinates anymore
- **Country list**
  - names come from the `world-countries` npm package (data only)
  - the picker UI (`components/Picker`) is a generic, custom modal + search list, no built-in knowledge of countries, just `label`/`value`/`options`/`onChange`
  - not a bundled picker component, so it stays visually consistent with the rest of the screen
  - Onboarding passes it the country list, defaults to `Finland`, since commu is a Finnish product
- **Backend URL**
  - worked out in `src/api/client.ts` from `Constants.expoConfig.hostUri`, the LAN IP Metro is bound to (same IP the device already used to load the JS bundle)
  - `localhost` only resolves to the backend on the iOS simulator, since it shares the Mac's network namespace
  - Android emulators and physical devices are separate machines on the network, need the real LAN IP instead
  - that LAN IP only works if the backend was started with `php artisan serve --host=0.0.0.0`
  - default (`127.0.0.1`) rejects connections from anything but the backend's own machine, silently hangs every request from a phone/emulator (see root README)
  - no dev-server host available (e.g. standalone build): falls back to `EXPO_PUBLIC_BACKEND_GRAPHQL_URL` env var, must be set by hand, throws on startup if missing
- **Errors on screen**
  - `geocodeTown`'s `extensions.category` maps `not_found` and `upstream` to distinct messages
  - GPS permission denial and reverse-geocode failure (no address for the coordinates) each get their own message, with a nudge back to manual entry
- **Home screen**
  - fetches nearby notices and an area summary from the backend
  - keyed on the saved location and the search distance set in Settings
- **No automated tests**, per this repo's testing policy
  - verification is manual (Expo Go / emulator), against the golden paths and error cases listed in the originating issue
  - not yet run, since this screen was built in an environment without an emulator or device attached
  - run it before merging
