# commuapp-hiring

Laravel backend + Expo mobile app. User enters a home town, sees nearby help posts plus a generated area summary.

## Setup

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
```

Run:

```bash
php artisan serve
```

GraphQL endpoint: `POST http://127.0.0.1:8000/graphql`. See `backend/README.md` for query examples and error shape.

### Mobile app (Expo)

_Not built yet._

## Decisions

### API format (REST vs GraphQL vs other)

GraphQL, via Laravel Lighthouse. The upstream Commu API is GraphQL, so a GraphQL backend needs less translation between the two — types and fields largely carry straight through instead of being reshaped into a REST DTO. It's also schema-explorable by default (GraphiQL), and interfaces/types generated from the schema make it easy to generate TS types for the mobile app later.

### Geocoding API

Nominatim (OpenStreetMap): `https://nominatim.openstreetmap.org/search`. No auth, no key management, one HTTP call, and easy to swap later if needed.

### `notice*` query chosen

`noticesWhereDistance`. It's the one built specifically for "what's near this point": takes `lat`/`long`/`distance` directly (no bounding-box math like `noticesWhereLocation`) and returns a real paginator (`paginatorInfo` + `data`), so a caller can tell whether more results exist. Our own backend exposes a query of the same name, mirroring the upstream coordinate/radius/pagination input shape, mapped through a schema-driven, code-generated PHP GraphQL client ([Sailor](https://github.com/spawnia/sailor)) rather than hand-built query strings.

### Search distance

15 km default (`distance: Int! = 15000`, meters — caller can override). Covers a city plus its immediate surroundings for the four test towns (Helsinki, Vantaa, Tampere, Turku) without pulling in results from an unrelated neighboring city.

### `Notice` fields selected

Identity, title, description, notice type, give/need side, category (main + sub), creation timestamp, geographic position, and distance from the search point. Fields tied to notice hierarchy (parent/child/level), engagement counts (likes, views), deal/invite data, and org-level aggregates are excluded — not relevant to a "what's being asked for nearby" list view.

Argument names (`lat`/`long`) and the response field names (`paginatorInfo`/`data`, `created_at`, `distance_to_user`, `categories`) deliberately mirror the upstream Commu query verbatim, rather than being reshaped into this project's own naming conventions — keeps the mapping between our API and the upstream one obvious.

Sort order is hardcoded server-side to most-recent-first (`CREATED_AT DESC`) rather than exposed as a caller option — the upstream query only ever supports that one sort column, so there's nothing to choose between. Notice type/category/theme filter arguments aren't exposed either, since no preferences/filtering UI exists in this task's scope.

### Caching approach

Redis-backed (`predis/predis`, no compiled extension, low local-setup friction).

**Implemented:** geocoding results. Key is a trimmed, lowercased town name (`geocode:{town}`); TTL is long (30 days, `GEOCODE_CACHE_TTL_SECONDS`) since a town's coordinates are effectively static. Cache operations fail open — if Redis is unreachable, the operation falls through to the live path (and logs a warning) instead of failing the request. This fail-open logic lives in one shared helper (`App\Services\Cache\FailOpenCache`) so the caching planned for notice-batches and generated summaries can reuse it rather than re-deriving the fallback.

**Not implemented (by design):** the `noticesWhereDistance` list itself stays uncached — it's meant to feel real-time, and caching a paginated live feed adds staleness for little benefit at this scale.

**Hypothetical (deferred to the area-summary work):** the summary endpoint will own its own short-TTL (~30 min) cache of the generated summary, plus a short-TTL (~5 min) cache of the notice batch that feeds it — separate from, and decoupled from, the posts list's pagination, so a page fetch never triggers a summary regeneration.

### Bedrock model & summary approach

_TBD_

## How this was implemented

_TBD_

## What I'd improve next

_TBD_
