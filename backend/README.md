# backend

Laravel + [Lighthouse](https://lighthouse-php.com) GraphQL API. Plain `composer create-project`, no Docker/Sail. No SQL database — nothing here needs one.

Two queries so far:

- `geocodeTown` — resolves a town name to coordinates via [Nominatim](https://nominatim.org), Redis-cached.
- `noticesWhereDistance` — fetches nearby help posts from the upstream Commu API for a coordinate, via a schema-driven, code-generated PHP GraphQL client ([Sailor](https://github.com/spawnia/sailor)).

## Setup

Requires a local Redis instance (e.g. `brew install redis && brew services start redis`).

```bash
composer install
cp .env.example .env
php artisan key:generate
```

`.env.example` lists every key blank on purpose (project policy: no default
values for env vars anywhere). Fill in `.env` after copying it:

- `APP_NAME=Laravel`, `APP_ENV=local`, `APP_DEBUG=true`, `APP_URL=http://localhost`
- `LOG_CHANNEL=stack`, `LOG_LEVEL=debug`
- `CACHE_STORE=redis`
- `LIGHTHOUSE_QUERY_CACHE_MODE=opcache` — required, see Notes below for why
- `NOMINATIM_BASE_URL` — e.g. `https://nominatim.openstreetmap.org/search`
- `NOMINATIM_USER_AGENT` — a real identifying string (e.g. `your-app (you@example.com)`).
  Nominatim's usage policy blocks generic/unidentified User-Agents.
- `GEOCODE_CACHE_TTL_SECONDS` — seconds, long (a town's coordinates don't change)
- `REDIS_CLIENT` — `predis` (no compiled-extension dependency)
- `REDIS_HOST`, `REDIS_PASSWORD`, `REDIS_PORT` — your local/hosted Redis connection details
- `REDIS_CACHE_DB` — which Redis logical DB the cache store uses
- `REDIS_CACHE_CONNECTION` — which `database.redis` connection the `redis` cache store uses (see `config/database.php` and `config/cache.php`)
- `COMMU_GRAPHQL_URL` — the upstream Commu GraphQL endpoint
- `COMMU_BEARER_TOKEN` — see root README's authentication section for how to obtain one.
  Expires roughly hourly; re-copy it from DevTools when requests start 401ing.

## Run

```bash
php artisan serve
```

GraphQL endpoint: `POST http://127.0.0.1:8000/graphql`

```graphql
query ($town: String!) {
  geocodeTown(town: $town) {
    town
    latitude
    longitude
  }
}
```

```graphql
query ($latitude: Float!, $longitude: Float!) {
  noticesWhereDistance(latitude: $latitude, longitude: $longitude) {
    count
    currentPage
    hasMorePages
    notices {
      id
      title
      description
      type
      side
      createdAt
      distanceMeters
      position {
        latitude
        longitude
      }
      category {
        main {
          key
        }
        sub {
          key
        }
      }
    }
  }
}
```

## Errors

Neither query ever returns a null result — a failure is a distinct error, not
an empty or null payload. Error categories surface in `extensions`:

- `extensions.validation` — blank/whitespace-only `town`, or an out-of-range `latitude`/`longitude` (Lighthouse's `@rules`)
- `extensions.category: "not_found"` — `geocodeTown`: no Nominatim match
- `extensions.category: "upstream"` — Nominatim or Commu timeout, non-200/GraphQL error, or connection failure

A location with zero nearby notices is **not** an error — `noticesWhereDistance`
returns a normal result with an empty `notices` list and `count: 0`.

## Notes

- `LIGHTHOUSE_QUERY_CACHE_MODE=opcache` writes Lighthouse's parsed-query cache
  to local PHP files rather than the (unused, since there's no SQL database
  here) `database` cache store.
- `bootstrap/app.php` excludes the `/graphql` route from Laravel's default
  `TrimStrings`/`ConvertEmptyStringsToNull` middleware. GraphQL distinguishes
  `""` from `null`; those middleware would otherwise collapse an empty `town`
  string to `null` before it ever reached our `@rules` validation.
- `config/database.php` holds only the `redis` connection — Laravel's
  `RedisManager` reads `config('database.redis')` unconditionally, so the file
  has to exist and keep that name even though there's no SQL database.
- `noticesWhereDistance` sorts most-recent-first server-side; there's no
  caller-supplied sort order. The list itself is not cached — see the root
  README's caching section for why, and for what's cached (geocoding) vs.
  planned (notice-batch/summary, later work).
- The upstream Commu client is generated from `app/Services/Commu/Sailor/schema.graphql`
  (a trimmed SDL containing only `Query.noticesWhereDistance` and its
  transitively reachable types, not the full upstream schema) plus the
  operation files under `app/Services/Commu/Sailor/operations/`. Regenerate
  with `vendor/bin/sailor` after editing either. `sailor.php` at the repo root
  is the codegen + runtime client config (endpoint URL, auth header).
