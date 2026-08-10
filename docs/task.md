# Technical Task

## Task goal

Build a small application consisting of a **Laravel backend** and an **Expo (React Native) mobile app** that demonstrates your ability to:

- make reasonable product and engineering decisions from incomplete requirements
- integrate external APIs (GraphQL + geocoding + LLM)
- design a sensible API boundary between a mobile client and a backend
- structure a clean, maintainable solution without overengineering

This mirrors our actual stack: Laravel on the backend, Expo on the mobile side.

## Task overview

A user enters their home town in the mobile app and sees nearby help posts plus a short generated summary of what kinds of help are typically requested in that area.

### Flow

1. User enters a home town (text input) in the Expo app.
2. The app calls your Laravel API.
3. The backend converts the town into latitude / longitude using a geocoding API of your choice.
4. The backend fetches nearby help posts from the Commu GraphQL API using those coordinates.
5. The backend generates a short area summary using AWS Bedrock (mandatory).
6. The app renders:
   - a list of help posts
   - the area summary, e.g. *"Tampere has mostly animal related requests with some occasional moving aid"*

## Backend (Laravel)

The Laravel app is an API backend. There is no server-rendered UI.

- **API format is your choice** — REST, GraphQL, or something else. Explain your choice in the README.
- The backend is the only component that talks to the Commu API. The bearer token must never reach the mobile app.
- Geocoding happens in the backend.
- Bedrock summary generation happens in the backend.
- **Caching is optional.** If you implement it, you decide what to cache (upstream notice data, geocoding results, generated summaries), how you key it, what TTL you use, and how it is invalidated. If you skip it, briefly describe in the README what you would cache and why — we're interested in the reasoning either way.

## Mobile app (Expo)

- Keep it simple. A single screen is perfectly fine.
- Your designer skills are not being tested; any UI is fine as long as it's decent.
- Basic loading and error states are expected.
- Running via Expo Go is fine — no need for native builds or store distribution.
- Focus on correctness and clarity.

## Using the Commu GraphQL API

The GraphQL schema is public and explorable at: https://office.commuapp.fi/graphiql

The queries relevant to this task are the ones named `notice*`. Explore the schema, pick the one you think fits the task best, and briefly explain why you chose it over the alternatives.

**Notice** and **Help Post** are the same thing — `Notice` is the entity name in our API, *Help Post* is the term used in the product UI.

You must choose:

- which `notice*` query to use
- what search radius / distance to use
- which `Notice` fields to query
- how many results to consider "recent"
- whether to use pagination or the defaults

Make reasonable decisions based on the schema and API behaviour, and briefly explain your choices in the README.

## Authentication (simplified)

The Commu API requires a bearer token. **Authentication is not part of this task — do not build a login or OAuth flow.**

Instead:

1. Go to https://app.commuapp.fi and register / log in.
2. Open DevTools → Network tab.
3. Select any GraphQL request.
4. Copy the `Authorization` header value.
5. Use it in your Laravel app as: `Authorization: Bearer <token>`

Requirements:

- Read the token from environment variables (e.g. `COMMU_BEARER_TOKEN`)
- Do not commit the token
- Include an `.env.example`

**Note:** the token expires after roughly one hour. If requests start returning 401/403, re-copy the token from DevTools.

## Summary generation (AWS Bedrock)

- Use AWS Bedrock via the AWS SDK (mandatory).
- The free tier is enough to get started. If you have already used your free tier, roughly 1 € buys on the order of a million tokens. If you want to close your AWS account afterwards, see: https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-closing.html
- Choose any Bedrock-supported model you feel is appropriate.

### Getting started with Bedrock

You don't need to spend much time on this — a few pointers to save you the trouble:

- **The Quickstart section in the Bedrock console sidebar is excellent.** Start there; it gets you to a working call quickly.
- **Recommended models:** the Claude 4 series, the OpenAI models, or Amazon Nova. All are straightforward to get running. Serverless foundation models are enabled by default, though Anthropic models require a one-time usage form before first use — you can submit it from the console playground.
- **Use the Converse API pattern** rather than raw `InvokeModel`. It gives you a consistent request and response shape across providers, so swapping models later is a one-line change.
- **Your calls will most likely need an inference profile ID** rather than a bare model ID. You'll find these under **Inference profiles** in the Bedrock console sidebar.

The summary should describe:

- what kinds of help posts appear in the area
- relative frequency or themes (e.g. "mostly food aid, some moving help")

Output expectations:

- 2–4 sentences, or 4–6 bullet points
- grounded in the fetched notices
- if there isn't enough data, say so

## Error handling

Handle the obvious cases only:

- empty input
- no geocoding result
- no notices returned
- upstream failure (Commu API or Bedrock unavailable) surfaced to the app in a sensible way

Do not spend time on exhaustive retries, resilience, or global error frameworks.

## Test locations

Use these Finnish towns for development and testing:

- Helsinki
- Vantaa
- Tampere
- Turku

## How you solve this is up to you

Solve this task however you work best. Use AI coding agents, prompt tooling, IDE assistants, or write everything by hand — we have no preference, and using agents is neither a bonus nor a penalty.

What we *do* care about is that you can explain how you got to the result. We want to understand your process: how you approached the problem, where you made decisions yourself, where you delegated, and how you verified the output.

## Deliverables

Provide:

- Git repository link (a monorepo or separate backend/app repositories are both fine)
- A README including:
  - setup & run instructions for both the backend and the Expo app
  - which API format you chose for your backend (and why)
  - which geocoding API you chose (and why)
  - which `notice*` query you chose (and why)
  - chosen distance (and why)
  - which `Notice` fields you selected (and why)
  - your caching approach, implemented or hypothetical (what, where, TTL, invalidation — and why)
  - which Bedrock model you used, and a brief description of your summary approach
  - **how you implemented this task**: your working process, the tools and agents you used (if any), which parts you delegated versus wrote yourself, and how you validated the result
  - a short "What I'd improve next" section

If you find anything to be unclear, reach out to us with a low threshold!
