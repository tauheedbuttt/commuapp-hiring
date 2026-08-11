# backend

Laravel + [Lighthouse](https://lighthouse-php.com) GraphQL API. Plain `composer create-project`, no Docker/Sail. No SQL database, nothing here needs one.

Full API surface lives in `graphql/schema.graphql`, resolvers under `app/GraphQL/Queries/`.

## Setup

Needs a local Redis instance first (e.g. `brew install redis && brew services start redis`).

```bash
composer install
cp .env.example .env
php artisan key:generate
```

`.env.example` already carries the values that are the same for every clone (Redis config, cache TTLs, the Commu/Bedrock endpoints). The keys below are the only ones left blank — each is either a secret or specific to you, so `.env.example` can't carry a value for it:

| key | what it is | where to get it |
|---|---|---|
| `COMMU_BEARER_TOKEN` | auth token for the upstream Commu API | log in at [app.commuapp.fi](https://app.commuapp.fi), open devtools → Network, copy the `Authorization: Bearer …` header off any API request. Expires; re-copy if requests start failing with an auth error. |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | AWS credentials for Bedrock | your own AWS account → IAM → create an access key. The account needs Bedrock model access for `eu.amazon.nova-2-lite-v1:0` in `eu-north-1` enabled first, under Bedrock → Model access in the AWS console. |
| `NOMINATIM_USER_AGENT` | identifies this app to the Nominatim geocoding API | [Nominatim's usage policy](https://operations.osmfoundation.org/policies/nominatim/) requires a descriptive user agent identifying the app and a contact, e.g. `"your-app-name (you@example.com)"`. Requests with a generic/missing one can get rate-limited or blocked. |
| `APP_KEY` | Laravel app encryption key | generated for you by `php artisan key:generate` below, not something to source yourself. |

Everything else in `.env.example` already has the value this app needs — copy it as-is.

## Run

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

`--host=0.0.0.0` is required if the mobile app will hit this backend. The default host for `php artisan serve` (`127.0.0.1`) only accepts connections from the same machine, not from a phone/emulator on the same network.

GraphQL endpoint: `POST http://127.0.0.1:8000/graphql`

## Errors

No resolver ever returns a null result on failure. A failure is a distinct error, not an empty or null payload.

Error categories surface in `extensions`:

- `extensions.validation`: request-level validation failures (Lighthouse's `@rules`)
- `extensions.category: "not_found"`: nothing matched the request (a town, a help post)
- `extensions.category: "upstream"`: a downstream service (geocoding, the summary model, or the upstream Commu API) timed out, errored, or refused the connection

A search with zero matching results is **not** an error. It comes back as a normal result with an empty list.

## Notes

- **Lighthouse query cache**
  - `LIGHTHOUSE_QUERY_CACHE_MODE=opcache` writes Lighthouse's parsed-query cache to local PHP files
  - not the `database` cache store, since that's unused here (no SQL database)
- **Empty string vs null**
  - `bootstrap/app.php` excludes the `/graphql` route from Laravel's default `TrimStrings`/`ConvertEmptyStringsToNull` middleware
  - GraphQL distinguishes `""` from `null`
  - without this exclusion, that middleware would collapse an empty string argument to `null` before it ever reached `@rules` validation
- **Redis-only config**
  - `config/database.php` holds only the `redis` connection
  - Laravel's `RedisManager` reads `config('database.redis')` unconditionally, so the file has to exist and keep that name, even with no SQL database
- **Fail-open caching**
  - `App\Services\Cache\FailOpenCache` wraps the cache store, one shared place, not reinvented per caller
  - a Redis outage degrades performance, not availability: a read/write failure logs a warning and falls through to the live path, same as a plain cache miss
- **AI-generated area summaries**
  - `App\Services\Summary\AreaSummaryService` orchestrates the flow: cached summary, then cached notice batch, then a live upstream fetch, then generation, short-circuiting as soon as a cache hit or a "not enough data" verdict is reached
  - text generation itself is `App\Services\Bedrock\BedrockSummaryGenerator`, AWS Bedrock's Converse API (Amazon Nova Lite)
  - the notice batch size going into generation was tuned against a live eval across Bedrock, not guessed, see `docs/bedrock-batch-size-eval.md` and `docs/brainstorming/notes.md`
- **Sorting and caching**
  - the nearby-posts list sorts most-recent-first server-side, no caller-supplied sort order
  - the list itself is not cached, only the area-summary flow caches (the summary result, plus its own notice batch, each on a short TTL)
  - see the root README's [Caching approach](../README.md#caching-approach) section for the full picture
- **Upstream Commu client**
  - generated from `app/Services/Commu/Sailor/schema.graphql` (a trimmed SDL, only the types this app actually touches, not the full upstream schema)
  - plus the operation files under `app/Services/Commu/Sailor/operations/`
  - regenerate with `vendor/bin/sailor` after editing either
  - `sailor.php` at the repo root is the codegen + runtime client config (endpoint, auth header)
