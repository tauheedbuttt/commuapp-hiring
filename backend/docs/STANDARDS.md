# Backend Standards

Project-wide conventions for this Laravel backend. Not tied to any one feature — apply these regardless of what slice you're building.

## Stack

- Laravel, plain `composer create-project`, no Docker/Sail.
- Lighthouse for GraphQL — schema-first SDL (`graphql/schema.graphql`) with PHP resolver classes, not hand-rolled `graphql-php`.
- `/graphql` is the only API surface. No server-rendered views, no separate REST routes.

## Code structure

- **Resolvers stay thin.** A query/mutation resolver in `app/GraphQL/Queries` or `app/GraphQL/Mutations` is a pass-through: pull args, call a service, return the result. No HTTP calls, no branching logic in the resolver itself.
- **Business/integration logic lives in services**, under `app/Services/<Domain>/`. Services have no GraphQL knowledge — no `ResolveInfo`, no GraphQL types — so they're usable outside the GraphQL layer and swappable independently of it.
- **Config over hardcoding.** Any URL, credential, or tunable value is read via `config()`, backed by `env()` in `config/services.php` (or a dedicated config file). Never inline a URL or key in a service or resolver.

## Env variables

- Every env var is set explicitly in `.env`. No default values anywhere — not in code (`env('X', 'default')` is disallowed), not in `.env.example`, not in docs.
- `.env.example` lists every key with no value, so it documents what must be set without smuggling in a working default.
- `.env` is never committed.

## Error handling

- One project-wide `ErrorCategory` backed enum (PHP 8.1+ native enum, string-backed) holding every category of error this backend throws deliberately (e.g. `not_found`, `upstream`). Lighthouse's own `validation` category, produced by the `@rules` directive, is separate and not part of this enum.
- One reusable exception class implementing `GraphQL\Error\ClientAware` and `GraphQL\Error\ProvidesExtensions`, taking an `ErrorCategory` case in its constructor. A new failure mode is a new enum case, not a new exception subclass.
- The category surfaces on the wire as `extensions.category`, so a client can branch on failure type without string-matching the message.
- GraphQL return types are non-nullable where "nothing found" is meaningfully different from "the field wasn't requested." A missing result is an error in `errors[]`, not a null payload the client has to null-check.

## Input validation

- Validate at the schema level with Lighthouse's `@rules` directive, so bad input is rejected before any resolver or service code runs.
- The `/graphql` route is excluded from Laravel's default `TrimStrings` and `ConvertEmptyStringsToNull` global middleware. GraphQL treats `""` and `null` as distinct values; those middleware silently collapse that distinction and can make `@rules` validation unreachable for empty-string input.

## Testing

- No automated tests — unit, integration, or feature — regardless of what a tool, skill, or template suggests. See root `CLAUDE.md`.
- Verification is manual: exercise the running server against real upstream services (not mocks) and record what was checked.

## Caching

- Lighthouse's parsed-query cache runs in `opcache` mode (`LIGHTHOUSE_QUERY_CACHE_MODE=opcache`), not the default `store` mode backed by Laravel's `database` cache driver. On SQLite, `store` mode mis-serializes the parsed AST and breaks every second-and-later request.
- Any feature-level caching (upstream data, computed results) is a per-slice decision, not a blanket default — document what's cached, the key, the TTL, and the invalidation trigger where it's added.

## Branching & PRs

See root `CLAUDE.md` for the branch-naming and PR-flow policy (`feat/[issue-id]/[description]`, forked from the current branch, PR back to it).
