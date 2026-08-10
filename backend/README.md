# backend

Laravel + [Lighthouse](https://lighthouse-php.com) GraphQL API. Plain `composer create-project`, no Docker/Sail.

This slice implements exactly one query, `geocodeTown`, resolving a town name to
coordinates via [Nominatim](https://nominatim.org). It exists to establish the
request shape (GraphQL query → validated input → service class → typed error)
this backend will reuse for the Commu API and Bedrock slices.

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
```

`.env.example` lists every key blank on purpose (project policy: no default
values for env vars anywhere). Fill in `.env` after copying it:

- `APP_NAME=Laravel`, `APP_ENV=local`, `APP_DEBUG=true`, `APP_URL=http://localhost`
- `LOG_CHANNEL=stack`, `LOG_LEVEL=debug`
- `DB_CONNECTION=sqlite`
- `CACHE_STORE=database`
- `LIGHTHOUSE_QUERY_CACHE_MODE=opcache` — required, see Notes below for why
- `NOMINATIM_BASE_URL` — e.g. `https://nominatim.openstreetmap.org/search`
- `NOMINATIM_USER_AGENT` — a real identifying string (e.g. `your-app (you@example.com)`).
  Nominatim's usage policy blocks generic/unidentified User-Agents.

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

## Errors

`geocodeTown` never returns a null result — no match is a distinct error, not
an empty payload. Three error categories surface in `extensions`:

- `extensions.validation` — blank/whitespace-only `town` (Lighthouse's `@rules`)
- `extensions.category: "not_found"` — no Nominatim match
- `extensions.category: "upstream"` — Nominatim timeout, non-200, or connection failure

## Notes

- `LIGHTHOUSE_QUERY_CACHE_MODE=opcache` is required in `.env`: Lighthouse's
  default `store` mode caches parsed query ASTs in the `database` cache store,
  which mis-serializes them on SQLite (`unserialize` returns
  `__PHP_Incomplete_Class` from the second request onward). `opcache` mode
  writes parsed queries to local PHP files instead, sidestepping that.
- `bootstrap/app.php` excludes the `/graphql` route from Laravel's default
  `TrimStrings`/`ConvertEmptyStringsToNull` middleware. GraphQL distinguishes
  `""` from `null`; those middleware would otherwise collapse an empty `town`
  string to `null` before it ever reached our `@rules` validation.
