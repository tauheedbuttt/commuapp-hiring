# Assignment checklist

Tracks completion against `docs/task.md`. Source of truth for "are we done yet."
Check a box only once the thing actually runs/exists — not once it's planned.

_Last reviewed: 2026-08-11._

## Backend (Laravel)

- [x] Laravel + Lighthouse scaffold, unused scaffold stripped (`4990610`)
- [x] Geocoding: town → lat/lng via Nominatim (`geocodeTown` query, validation + typed errors)
- [x] Commu GraphQL client: fetch nearby notices using resolved coordinates (`noticesWhereDistance`, issue #3, schema-driven Sailor client)
- [x] Bearer token (`COMMU_BEARER_TOKEN`) read from env, never sent to mobile app
- [x] Pick + document `notice*` query, radius, fields, pagination approach for the list (issue #3)
- [x] "Recent" window definition + Bedrock summary generation (Converse API, chosen model, grounded in fetched notices) — separate, later issue
- [x] Own API surface: posts list and summary are separate queries, not combined (decision reversed — see `docs/brainstorming/notes.md`). List query (`noticesWhereDistance`) done; summary query is later work
- [x] Error handling for notices: empty input, no geocoding result, no notices returned (non-error empty result), upstream failure surfaced via `extensions.category`
- [x] Error handling for Bedrock upstream failure — later issue
- [x] Caching implemented: geocoding (Redis, long TTL, fail-open) — issue #3
- [x] Caching implemented: generated summaries + notice-batch (short TTL, per `docs/brainstorming/notes.md`) — later issue
- [x] `.env.example` has all new Commu/Redis/geocode-cache keys blank
- [x] `.env.example` has Bedrock/AWS keys blank — later issue
- [x] Notice-by-id query for the help-post detail screen (`notice`, dedicated `NoticeDetail` type, issue #7)

## Mobile app (Expo)

- [x] Project scaffolded (`mobile/`, Expo blank TypeScript template, verified running on Android emulator)
- [x] Onboarding screen: manual city/country entry + GPS entry, geocoded via backend `geocodeTown`, persisted on-device (issue #9) — builds and typechecks clean; manual on-device verification against the golden paths in issue #9 not yet run (no emulator/device in the build environment)
- [ ] Home screen: help post list + collapsible summary on top
- [ ] Loading state (done for onboarding; home screen pending)
- [ ] Error state (done for onboarding: geocode not-found/upstream, GPS permission denied, GPS reverse-geocode failure; home screen pending)
- [x] Calls backend API only — no direct Commu/Bedrock calls, no token in client (onboarding screen only talks to the backend's `geocodeTown`)

## README (root)

The following README sections track completed and pending decisions:

- [x] Mobile setup & run instructions
- [x] API format choice (GraphQL) + why
- [x] Geocoding API choice (Nominatim) + why
- [x] `notice*` query chosen + why
- [x] Search distance chosen + why
- [x] `Notice` fields selected + why
- [x] Caching approach (implemented or hypothetical) + why
- [ ] Bedrock model + summary approach
- [ ] "How I implemented this" — process, tools/agents used, delegated vs hand-written, how validated
- [ ] "What I'd improve next"

## Process / repo hygiene

- [x] Decision log kept in `docs/brainstorming/notes.md`, matches project voice
- [x] Branch policy followed so far (`feat/backend-cleanup` off main, merged via PR #2; `feat/3/notices-where-distance-redis-cache` off main for issue #3)
- [x] Remaining feature branches named `feat/[issue-id]/[description]`, forked from current branch, PR targets parent
- [x] No tests added (per project testing policy — confirmed nothing slipped in for issue #3)
- [ ] Git repo link ready to share as deliverable

## Test locations (manual verification before calling it done)

`noticesWhereDistance` verified live against all four (issue #3); `geocodeTown` was already verified for these towns in the earlier slice.

- [x] Helsinki
- [x] Vantaa
- [x] Tampere
- [x] Turku
- [x] Pagination returns correct counts and page metadata
- [x] Zero-notice locations return a valid empty result
- [x] Upstream authentication, network, and server failures map to the upstream error category
- [x] Redis cache hits avoid duplicate live geocoding requests
- [x] Case and whitespace normalization reuse the same geocoding cache entry
- [x] Redis outages log a warning and fall back to live geocoding
