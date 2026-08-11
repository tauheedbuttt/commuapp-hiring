# commuapp-hiring

Laravel backend + Expo mobile app. User enters a home town, sees nearby help posts plus a generated area summary.

<p align="center">
  <img src="docs/demo/demo.gif" alt="Demo: entering a home town and browsing nearby help posts with an AI-generated area summary" width="300" />
</p>

## Table of contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [Backend](#backend)
  - [Mobile app (Expo)](#mobile-app-expo)
- [Environment variables](#environment-variables)
- [Decisions](#decisions)
  - [API format (REST vs GraphQL vs other)](#api-format-rest-vs-graphql-vs-other)
  - [Geocoding API](#geocoding-api)
  - [`notice*` query chosen](#notice-query-chosen)
  - [Search distance](#search-distance)
  - [`Notice` fields selected](#notice-fields-selected)
  - [Caching approach](#caching-approach)
  - [Bedrock model & summary approach](#bedrock-model--summary-approach)
- [How I implemented this](#how-i-implemented-this)
- [What I'd improve next](#what-id-improve-next)

## Prerequisites

- PHP 8.3+ and Composer
- A local Redis instance running (caching, see [Caching approach](#caching-approach))
- Node.js and npm, for the Expo app
- The Expo Go app on a phone, or an Android/iOS emulator, to run the mobile app
- A Commu bearer token, copied from a logged-in session at app.commuapp.fi (see `backend/README.md` for how)
- An AWS account with Bedrock access, for the area summary (see `backend/README.md` for model access setup)

## Setup

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Run:

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

`--host=0.0.0.0` is required, not optional — `php artisan serve`'s default
(`127.0.0.1`) only accepts connections from the same machine. The mobile app
needs the backend reachable from a phone/emulator on the same network, which
`127.0.0.1` cannot do (see `mobile/README.md`'s Notes section for why).

GraphQL endpoint: `POST http://127.0.0.1:8000/graphql`. See `backend/README.md` for query examples and error shape.

### Mobile app (Expo)

```bash
cd mobile
npm install
```

Run (needs the backend running locally, see above):

```bash
npm start
```

Then scan the QR code with Expo Go, or `npm run android` / `npm run ios`. See
`mobile/README.md` for structure, codegen, and the onboarding-screen flow.

## Environment variables

`.env.example` lists every key blank on purpose, per this repo's env var policy — no defaults committed anywhere, fill each one by hand.

### Backend (`backend/.env`)

| Key | What it's for |
|---|---|
| `APP_NAME` | Laravel app name |
| `APP_ENV` | Laravel environment (`local`, `production`, etc.) |
| `APP_KEY` | Laravel encryption key, set via `php artisan key:generate` |
| `APP_DEBUG` | Laravel debug mode |
| `APP_URL` | Base URL Laravel assumes for itself |
| `LOG_CHANNEL` | Laravel log channel |
| `LOG_LEVEL` | Laravel log verbosity |
| `CACHE_STORE` | Laravel cache driver (`redis` here) |
| `LIGHTHOUSE_QUERY_CACHE_MODE` | Lighthouse's parsed-query cache mode, see `backend/README.md` |
| `NOMINATIM_BASE_URL` | Geocoding endpoint, see [Geocoding API](#geocoding-api) |
| `NOMINATIM_USER_AGENT` | User-Agent Nominatim requires on requests |
| `REDIS_CLIENT` | Redis PHP client (`predis`), see [Caching approach](#caching-approach) |
| `REDIS_HOST` | Redis host |
| `REDIS_PASSWORD` | Redis auth password |
| `REDIS_PORT` | Redis port |
| `REDIS_CACHE_DB` | Redis logical DB index used for caching |
| `REDIS_CACHE_CONNECTION` | Named Redis connection backing the cache store |
| `GEOCODE_CACHE_TTL_SECONDS` | Geocoding cache TTL |
| `SUMMARY_CACHE_TTL_SECONDS` | Area-summary cache TTL |
| `NOTICE_BATCH_CACHE_TTL_SECONDS` | Notice-batch-behind-the-summary cache TTL |
| `COMMU_GRAPHQL_URL` | Upstream Commu GraphQL endpoint |
| `COMMU_BEARER_TOKEN` | Upstream Commu bearer token — see [Prerequisites](#prerequisites) for how to get one; never sent to the mobile app |
| `AWS_ACCESS_KEY_ID` | AWS credential for Bedrock |
| `AWS_SECRET_ACCESS_KEY` | AWS credential for Bedrock |
| `BEDROCK_MODEL_ID` | Bedrock inference profile ID, see [Bedrock model & summary approach](#bedrock-model--summary-approach) |
| `BEDROCK_AWS_REGION` | AWS region for the Bedrock inference profile |
| `SUMMARY_NOTICE_BATCH_COUNT` | How many recent notices feed the summary prompt |
| `SUMMARY_MIN_NOTICES` | Minimum notices required before generating a summary; below this returns "not enough data" |

### Mobile (`mobile/.env`)

| Key | What it's for |
|---|---|
| `EXPO_PUBLIC_BACKEND_GRAPHQL_URL` | Backend GraphQL URL — only needed when there's no Metro dev-server host to derive it from, see `mobile/README.md` |

## Decisions

### API format (REST vs GraphQL vs other)

GraphQL, via Laravel Lighthouse.

- Upstream Commu API is GraphQL too. Same format, less translation, fields carry through instead of reshaping into REST DTOs.
- Schema-explorable by default via GraphiQL. No separate docs tool needed.
- Schema-generated types make TS codegen for mobile easy, no hand-maintained types.
- Commu leans GraphQL. Building this way meant actually learning it, useful past this task.

**Call flow: 3 calls, not 1 combined.**

- Task doc's flow (town in, backend geocodes, fetches notices, generates summary) describes the product flow, not a single-call contract.
- `geocodeTown` runs once, on submit.
- App caches the returned lat/long client-side.
- `noticesWhereDistance` and `areaSummary` both reuse those cached coords.
- Pagination and refresh never re-geocode.
- Pagination never regenerates the summary either. A combined endpoint would re-run Bedrock on every page fetch, wasted cost and latency for no new summary.

### Geocoding API

Nominatim (OpenStreetMap): `https://nominatim.openstreetmap.org/search`.

- No auth.
- No key management.
- One HTTP call.
- Easy to swap later if needed.

### `notice*` query chosen

`noticesWhereDistance`.

| query | shape | why (not) chosen |
|---|---|---|
| `noticesWhereDistance` | radius from a point (`lat`/`long`/`distance`), real paginator | **Chosen.** Built for "what's near this point," radius is a first-class arg, no box math needed. `paginatorInfo` + `data` means caller knows if more pages exist. |
| `noticesWhereLocation` | bounding box (`latMax`/`latMin`/`longMax`/`longMin`) | Same job, wrong shape. Would need to hand-convert center + radius into a box on every call. Plain list, no paginator. |
| `noticesWhereLocationFiltered` | same bounding box, structured `NoticeSearch` filter | Same box-math problem as above. No auth required, but that's not a deciding factor here. |
| `noticesByQueryWord` | keyword search, cursor pagination | Built for text search, not proximity. No radius/distance arg at all. |
| `popularNotices` | popularity-ranked near a point | Ranks by popularity, not recency, task wants "recent." Plain list, no paginator, no radius control. |

`noticesWhereParent` left out of the table entirely. Schema's own doc comment says it's hierarchical (parent/child notices), not a location search, despite the `notices*` name.

Our backend exposes the same query name, mirroring upstream's coordinate/radius/pagination shape. Mapped through [Sailor](https://github.com/spawnia/sailor), a schema-driven, code-generated PHP GraphQL client. No hand-built query strings.

### Search distance

15 km default, caller can override.

- Backend schema default: `distance: Int! = 15000` (meters).
- Mobile settings store default: `DEFAULT_DISTANCE_METERS = 15000`. Same value, kept in sync by hand on both sides.
- Doesn't pull in results from an unrelated neighboring city.
- User can adjust it in Settings, 1 to 100 km.

How I picked 15: fetched real coordinates for the four test towns from my own `geocodeTown` endpoint, then plugged each pair into [freemaptools.com/radius-around-point.htm](https://www.freemaptools.com/radius-around-point.htm) and eyeballed how much of the city a circle at different radii actually covered. Using the coordinates my own API returns, not ones looked up separately, kept the check honest to what the app actually sees.

Best-fit radius per city:

- Helsinki: 20 km
- Tampere: 10 km
- Turku: 15 km
- Vantaa: 10 km

Averages out to 15, so that's the default.

### `Notice` fields selected

Two separate types, `Notice` for the list and `NoticeDetail` for the detail screen. Reason: a list card and a full detail page need different fields, forcing one shared type would either bloat the card or starve the detail page.

General rule behind both: replicate the real Commu app's UI as the target, then keep only the fields that UI and this task actually need. Fields the real app shows but this task doesn't require, or can't support, were left out.

**List (`Notice`, via `noticesWhereDistance`):**
- `id`, `title`, `description`
- `type` (give/need/collector)
- `created_at`, `distance_to_user`
- `categories.main.key`
- `image.url`
- `owner` (`id`, `name`, `avatar_url`)
- `company` (`id`, `name`, `logo_url`), shown instead of `owner` when a post was made by an org

**Detail (`NoticeDetail`, via `notice(id, lat, long)`):**
- everything the list has, plus:
- `in_return`, `side`, `expires_at`, `likes`
- `position` (for the map preview)
- `categories.sub` (list card omits sub-category, detail has room for it)

**Left out, and why:**
- `trust_level` — raw int, no documented range (e.g. is 80 "Awesome"? out of what, 100?) or label mapping upstream, so skipped it rather than guess
- `accountVerifications` — no verified badge shown anywhere else in the app, dropped for consistency
- `notice_language_versions` — no translation feature built, would be dead data with nothing to render it
- notice hierarchy (parent/child/level), deal/invite data, org-level aggregates — not relevant to a "what's nearby" list or detail view

**Type and category chips (list card and detail):**
- List card shows two chips: the `type` chip and the main-category chip
- Detail screen adds a third: the sub-category chip, since the detail page has room for it
- Type chip is color-coded by notice type (give/need/collector); category chips always use one neutral color
- `categories.sub` is only added to the mobile `notice(id)` query, not `noticesWhereDistance` — keeps the list query minimal

- Arg/field names (`lat`/`long`, `paginatorInfo`/`data`, `created_at`, `distance_to_user`, `categories`) mirror upstream verbatim, not reshaped. Keeps mapping to upstream obvious.
- Sort hardcoded server-side, `CREATED_AT DESC`. Upstream only supports one sort column, nothing to expose.
- No type/category/theme filter args. No preferences/filtering UI in scope.

### Caching approach

Redis, through `predis/predis`.

Idea going in: use a good, well-known cache, keep setup as light as possible. Redis fit that. Client choice came down to this:

| | predis | phpredis |
|---|---|---|
| setup | `composer require`, pure PHP | needs compiled PHP extension |
| speed | slower | faster |
| local dev friction | none | install/build step per machine |

Went with predis. Speed edge from phpredis wasn't worth the extra setup step for a task this size.

What's cached:

- Geocoding results. Key `geocode:{town}` (trimmed, lowercased).
  - TTL 30 days (`GEOCODE_CACHE_TTL_SECONDS`): town coords don't move.
- Area summary. `areaSummary` caches the generated summary.
  - TTL ~30 min (`SUMMARY_CACHE_TTL_SECONDS`): new posts in 30 min rarely shift theme, summary stays same anyway.
- Notice batch behind the summary. Cached separately from the summary.
  - TTL ~5 min (`NOTICE_BATCH_CACHE_TTL_SECONDS`): short, kept apart from summary TTL, page fetch never triggers regen, next regen gets near-fresh data.
- Summary/batch keys: `{town}:{distance}`, same normalization as geocoding.
  - no collision across radii, same town.

Left out on purpose:

- `noticesWhereDistance` list itself. Supposed to feel live. Caching a paginated feed adds staleness for little benefit at this scale.

Invalidation:

- None manual. TTL expiry is the only invalidation, each key resets itself once its window passes.
- This use case doesn't call for anything more. Summary and notice-batch TTLs are already short (30 min, 5 min), stale data clears itself out fast on its own.
- One case where manual invalidation would earn its keep: a hard refresh (pull-to-refresh) forcing a fresh summary instead of waiting out the TTL. Not implemented, see [What I'd improve next](#what-id-improve-next).

Fail-open behavior:

- Redis down shouldn't take the app down. Every cache read/write fails open, if Redis unreachable, falls through to live path, logs a warning, request still succeeds.
- Logic lives in one place, `App\Services\Cache\FailOpenCache`. Geocoding, summary cache, batch cache all share it, no reinventing the fallback three times.

### Bedrock model & summary approach

Amazon Nova Lite, via the raw `aws/aws-sdk-php` Converse API.

- Model: `eu.amazon.nova-2-lite-v1:0` inference profile, region `eu-north-1`.
  - picked over Claude-on-Bedrock to skip the one-time Anthropic access request, not a quality call.

Flow, owned by `AreaSummaryService`:

- check summary cache first.
- miss: check notice-batch cache.
- miss: fetch a fresh batch (`SUMMARY_NOTICE_BATCH_COUNT` posts, `CREATED_AT DESC`), reuses `NoticeSearchService::searchNearby`, no new Commu query.
  - N=30, measured not guessed. Swept N against live Bedrock across all four task towns, summary substance stabilizes at N=30 and stays the same through N=100, just at higher token cost. Full sweep in `docs/bedrock-batch-size-eval.md`.
- batch under `SUMMARY_MIN_NOTICES` posts: skip Bedrock, return canned "not enough data near {town}", cache it same TTL as a real summary.
- enough data: trim each notice to `title`, `description`, `type`, `side`, `categories` before prompting.
  - identity, position, distance, timestamps stripped, only theme-relevant fields reach the model.
- `BedrockSummaryGenerator` asks for 2-sentence plain prose, names the town, no markdown.

Failure handling:

- Bedrock/notice-fetch failures caught, logged, rethrown as `GraphQLClientException` / `ErrorCategory::Upstream`, same pattern as Commu failures.
- no bespoke retry/timeout logic, AWS SDK defaults only.

Credentials and config:

- AWS creds read by the SDK's default provider chain, `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` from env, no Laravel-side credential config.
- model id and region env-backed (`BEDROCK_MODEL_ID`, `BEDROCK_AWS_REGION`), swap model without touching code.

## How I implemented this

Before any technical work, I went through the real Commu app myself, screen by screen, to find the ones that matched this task: location entry, the nearby-posts feed, a help post's detail page. I saved screenshots of those in `docs/brainstorming/` (`Location Selection.png`, `Exploring nearby posts.png`, `Preferences.png`, `help-detail-page-*.png`, `Logo.png`) and built the mobile screens to match them. Commu's web app and mobile app share the same React Native code, so I pulled a lot of actual assets (logo, icons) straight from there instead of recreating them. The engineering manager reviewing this already knows the real app, so a UI that looks like it should be easier to read at a glance than something built from scratch.

I worked issue by issue. Every slice of work started as a GitHub issue with a written spec: the problem it solves, the decisions behind it, what's deliberately left out, how I'd check it worked. Nothing got built without a spec first.

Cross-cutting decisions, GraphQL vs REST, which geocoder, the caching shape, the search radius, which fields to expose, I worked out myself and logged in `docs/brainstorming/notes.md` as I went. `docs/brainstorming/steps.md` has the raw, chronological list of what I actually did, in order.

Before writing any spec I gave Claude Code the full Commu schema and had it work out which queries fit the task, rather than reading the whole schema myself. I checked its picks by calling the queries directly in Postman.

Build order: backend scaffold plus `geocodeTown` first. I'd never touched Laravel or Lighthouse, so I put real time into learning how a Laravel project is actually laid out before writing anything task-specific. I stripped the parts of the default scaffold I didn't need, then set up a Controller/Service split similar to what I'm used to in NestJS, resolver stays thin, a service class owns the actual logic. `geocodeTown` was the example that proved that structure out, before I reused the same shape for every query after it. Then `noticesWhereDistance` and Redis caching. Then the Bedrock summary. Then the notice-by-id query. Then the three mobile screens, onboarding, home, and notice detail, in that order.

Tools: Claude Code wrote the actual code, backend PHP and mobile TypeScript both. I didn't hand-type production code. I used [mattpocock/skills](https://github.com/mattpocock/skills) for the workflow, `/grill-me` to brainstorm with the agent on what to build and how, `/to-spec` to turn that into the actual GitHub issue as the source of truth, then `/implement` in a fresh session so the agent builds from the spec with clear context, then reviews its own work against that spec and the repo's standards. That's how every feature in this repo got built. After that, I verified the result myself, manually, against real cases.

Validation: no automated tests, that's project policy here. Every backend slice got hit directly against live dependencies, real Nominatim, the real Commu API, real Bedrock, local Redis, for all four towns in the task (Helsinki, Vantaa, Tampere, Turku), plus the failure cases: blank input, a town that doesn't exist, a bad token, Redis switched off. Mobile slices went through the same kind of pass on a real device/emulator via Expo Go, against the golden paths in each issue's spec.

## What I'd improve next

- **phpredis + proper Redis hosting.** Went with predis and local Redis for low setup friction, see [Caching approach](#caching-approach). Next step for real speed: phpredis extension plus a hosted Redis (Elasticache, Upstash, etc) instead of a local instance.
- **Monorepo.** I split backend and mobile into two plain folders with no shared tooling. Didn't know better going in. A monorepo would let both sides share the GraphQL schema and generated types directly, instead of the mobile app keeping its own copy of things the backend already defines.
- **Clear the summary cache on pull-to-refresh.** Right now pulling to refresh reloads the post list fresh but can still hand back a cached summary if it's within its TTL. That's correct behavior for the size of this task, but a real product would probably want refresh to mean refresh, summary included.
- **City/country autocomplete.** Store known cities and countries in the database, so typing in onboarding surfaces suggestions instead of a blind free-text field. Easier to enter, fewer typos, fewer failed geocodes.
- **Geocode city and country separately.** I currently concatenate them into one `"City, Country"` string and send that as a single `town` argument to Nominatim. Sending them as two separate fields would be more precise and less dependent on Nominatim parsing a combined string correctly.
- **More error categories.** The backend only has two of its own, `not_found` and `upstream`, plus Lighthouse's built-in `validation`. Upstream in particular is doing double duty for Commu failures and Bedrock failures. Splitting it by source would make failures easier to tell apart on the client.
- **A general-purpose Bedrock service.** `BedrockSummaryGenerator` as it stands is named and logged specifically for area summaries. I'd pull the actual Converse API call into a base service with no opinion about what it's being used for, so future features that need an LLM call don't have to route through something named for summaries.
- **Structured summary output.** The summary comes back as plain prose right now. If it came back as JSON instead, title, themes, rough category breakdown, the app could render it as chips or a small breakdown instead of a paragraph, which reads better on a small screen.
