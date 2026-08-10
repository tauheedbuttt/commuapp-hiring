DONT USE THIS DOC UNLESS SPECIFIED BY DEVELOPER

# Weekend Prep Spec — CommuApp Technical Assignment

**Company:** CommuApp (app.commuapp.fi / office.commuapp.fi)
**Contact:** Ronnie Nygren, Founder/Tech
**Status:** Interview passed, technical assignment arriving early next week (instructions + timeline TBD by CommuApp)
**Prep window:** Saturday Aug 8 (light evening session) → Sunday Aug 9 (full day) → light Monday morning review before instructions land
**Written:** 2026-08-08

---

## Problem Statement

The assignment tests skills against CommuApp's actual stack, and three of its core pieces are close to unknown territory right now:

- **Laravel/PHP** is the backend for their admin/ops side (`office.commuapp.fi`), confirmed by Ronnie in the interview as a significant part of the stack. There's zero hands-on PHP or Laravel experience to draw on.
- **GraphQL** shows up on the CV under backend skills, but the real depth is a single university course, mostly forgotten. Ronnie's email specifically calls out "endpoints, graphql etc" as something they'll measure — so this isn't a minor gap, it's squarely in the test's crosshairs.
- **Expo** (the framework the consumer app is actually built on, not bare React Native) has only been touched lightly, plus a rusty memory of react-native-web.

Two days isn't enough to become an expert in any of these. It is enough to go from "never touched it" to "can read the code, follow the patterns, and build something that works" — which is what an assignment actually tests. The risk isn't failing to know everything; it's freezing on Laravel or a GraphQL schema because nothing looks familiar.

## Solution

A sequenced, topic-by-topic weekend plan, ordered by how much each topic matters to CommuApp's stack multiplied by how big the current gap is. Each topic gets a short study pass (understand the mental model) followed immediately by a tiny hands-on build (prove the model actually works by using it), rather than reading through several topics back to back and building nothing. Saturday is reserved for lightweight orientation — the kind of study that works fine in short, tired evening blocks. Sunday is the deep-build day, blocked into four sequential sessions with meal/prayer breaks between them, ending with a short combined exercise that mimics what an actual timed assignment feels like.

## User Stories

> **Progress checklist.** Check a box off only once its build/artifact actually ran and passed (see Testing Decisions). Each story carries forward whatever earlier *checked* stories established — start it fresh on anything not yet checked, don't assume it.

**Block 1 — Laravel**
- [ ] **US1.** As a candidate with no PHP experience, I want to understand Laravel's request lifecycle (routes → controllers → models → views), so that I can read unfamiliar Laravel code without getting lost in unfamiliar syntax.
- [ ] **US2.** As a candidate with no PHP experience, I want to write a basic Eloquent model with a migration, so that I understand how Laravel maps database tables to PHP objects.
- [ ] **US3.** As a candidate with no PHP experience, I want to build a small CRUD flow in Blade (list, create, edit, delete), so that I've touched the actual templating syntax CommuApp's admin panel uses.
- [ ] **US4.** As a candidate who's heard Laravel Livewire is in play, I want a basic sense of how Livewire components work (server-driven reactivity without writing JS), so that if the assignment touches Livewire I'm not seeing the pattern for the first time.

**Block 2 — GraphQL + Apollo**
- [ ] **US5.** As a candidate who forgot most of a university GraphQL course, I want to re-derive how schemas, types, queries, mutations, and resolvers fit together, so that reading a real backend's schema doesn't feel like starting over.
- [ ] **US6.** As a candidate whose GraphQL experience is server-side only, I want to build a tiny GraphQL API and then consume it from a React frontend, so that both halves of the round trip are fresh.
- [ ] **US7.** As a candidate new to Apollo Client specifically, I want to use `useQuery` and `useMutation` against my own tiny API, so that the hook-based data-fetching pattern isn't unfamiliar during the assignment.
- [ ] **US8.** As a candidate new to Apollo's cache, I want to trigger a mutation and see how `InMemoryCache` handles (or fails to handle) refreshing the UI, so that I don't get blindsided by stale-data bugs under time pressure.
- [ ] **US9.** As a candidate who now knows their real experience is REST-first, I want a short personal reference on when GraphQL earns its complexity versus when REST is simpler, so that if CommuApp's own decision-doc pattern shows up in the assignment, I already have working judgment instead of guessing live.

**Block 3 — Expo + real-time**
- [ ] **US10.** As a candidate whose Expo experience is limited to basic navigation and exploring, I want to build a tiny screen using `expo-location` or `expo-image-picker`, so that I've called at least one real device-capability module before the assignment.
- [ ] **US11.** As a candidate with forgotten react-native-web experience, I want to run that same Expo screen in a browser tab, so that the web-target behavior isn't a surprise.
- [ ] **US12.** As a candidate who knows socket.io but not Pusher, I want to wire up a minimal Pusher channel (publish + subscribe), so that the pub/sub pattern transfers even though the API is new.

**Block 4 — Sentry + integration**
- [ ] **US13.** As a candidate who wants Sentry familiarity, I want to initialize Sentry in one small project and intentionally throw an error, so that I've seen a real error land in a dashboard once before it matters.
- [ ] **US14.** As a candidate preparing for a timed assignment, I want one short combined exercise pulling together GraphQL + a tiny Laravel or Expo piece, so that switching contexts under a clock feels rehearsed rather than novel.
- [ ] **US15.** As a candidate going into an assignment with an unknown scope, I want a one-page cheat sheet per topic (not a full notebook), so that during the actual assignment I can look something up in 30 seconds instead of re-reading tutorials.

## Implementation Decisions

**Sequencing and time budget** (~13 hours total, split Sat evening / Sun full day):

- **Saturday evening (~3h) — Orientation pass, low cognitive load:**
  - GraphQL fundamentals refresher: schema definition language, types, queries vs. mutations, how a resolver connects a field to actual data (~1.5h). Goal is recognition, not mastery — this gets built on Sunday.
  - Laravel orientation: what MVC means in Laravel's terms, the folder structure (`routes/`, `app/Http/Controllers`, `app/Models`, `resources/views`), and what `artisan` actually does. Skim, don't build yet (~1.5h).

- **Sunday — four sequential build blocks, in priority order, breaks between each:**

  **Block 1 — Laravel, deepest investment (~3.5h).** Install a fresh Laravel app locally. Build a minimal CRUD resource end to end: a migration for a table (something CommuApp-flavored, e.g. a "notice" with title/body/author), an Eloquent model, a controller with the standard resource methods, routes wired through `routes/web.php`, and Blade views for list/create/edit. If time allows, convert just the create form to a single Livewire component so the server-driven reactivity pattern (no manual JS wiring, no fetch calls) has been seen once, not just read about.

  **Block 2 — GraphQL + Apollo, second-deepest investment (~3h).** Stand up a minimal GraphQL server (Apollo Server or similar) with two or three types and both a query and a mutation. Then build a tiny React app that consumes it with Apollo Client: `useQuery` for reads, `useMutation` for writes, and deliberately watch what happens to the UI after a mutation with no `refetchQueries` set — then fix it. That broken-then-fixed cycle is the fastest way to actually understand `InMemoryCache` instead of just reading about it. Close this block by writing the REST-vs-GraphQL decision cheat sheet (user story 9) while it's fresh.

  **Block 3 — Expo + real-time (~2h).** In an Expo project, build one screen that calls a real device module — `expo-location` (get current position) or `expo-image-picker` (pick and display an image) — and confirm it also renders via react-native-web in a browser tab. Then spend the remainder wiring a minimal Pusher channel: subscribe on the client, trigger an event from a small script, confirm the client receives it. This is deliberately scoped small — the goal is "seen the shape of the API once," not building a feature.

  **Block 4 — Sentry + integration exercise (~1.5–2h).** Initialize Sentry in whichever of the above projects is easiest to touch, throw a deliberate error, confirm it lands in the dashboard. Then run one short timed exercise (self-imposed 45–60 min clock) that combines two of the above — for example, a GraphQL mutation that writes through to a tiny Laravel endpoint, or an Expo screen that calls the GraphQL API built in Block 2. This is the closest simulation of assignment conditions available without the real spec.

- **Monday morning (light, before instructions arrive):** re-read the four cheat sheets (Laravel, GraphQL/Apollo, Expo/Pusher, Sentry). No new material.

**Resource anchors** (official docs, not tutorials, since the goal is understanding the model, not following a recipe): Laravel's own documentation for routing/Eloquent/Blade/Livewire, Apollo's documentation for Apollo Server and Apollo Client, Expo's documentation for the specific modules above, Sentry's quickstart for whichever framework is used in Block 4.

**Explicitly deprioritized, no dedicated weekend time:**
- i18next — real gap but small surface area and AI-assistable during the actual assignment.
- PostHog — not part of CommuApp's actual stack per the DOM/bundle analysis; a "want to learn" item but not assignment-relevant this weekend.
- react-navigation, axios/REST, Formik/Yup/Zod, PostgreSQL/MongoDB schema modeling, and working under a timed clock — all confirmed solid already; no practice time allocated.

## Testing Decisions

Each block's "test" is simply: did the tiny build actually run and do the thing, without copy-pasting a finished tutorial. Specifically:

- **Laravel block passes** if the CRUD flow works end to end through a real browser click-through (create a record, see it in the list, edit it, delete it) without referring back to a tutorial for the last step attempted.
- **GraphQL/Apollo block passes** if the mutation-then-stale-UI problem was reproduced on purpose and then fixed, not just read about — reproducing the bug is what proves the cache model is understood, not just the happy path.
- **Expo block passes** if the device-module screen renders correctly in both a simulator/device and a browser tab (react-native-web), and if a Pusher event sent from a separate script is received live on the subscribed client.
- **Sentry block passes** if a deliberately thrown error is visible in the Sentry dashboard, not just "the SDK didn't crash."
- **Combined exercise passes** if it was attempted against a self-imposed clock rather than open-ended, since the real assignment will be timed.

No formal automated test suite is warranted here — this is personal skill-building, not production code, so the "test" is direct manual verification that each artifact works, plus the cheat sheet written immediately after each block while the material is still fresh (writing it down is itself a comprehension check).

## Out of Scope

- Deep Laravel mastery (queues, jobs, service containers, package development, testing with PHPUnit) — only enough to read and extend a Laravel app confidently.
- Production-grade GraphQL concerns (schema stitching, federation, N+1 query optimization, DataLoader) — only the core request/response and cache mechanics.
- Native iOS/Android builds or app store submission for the Expo work — web + Expo Go simulator is sufficient.
- Vue.js and Bootstrap specifically (also present in CommuApp's admin panel) — not covered this weekend; existing React knowledge should transfer reasonably well to Vue's component model if it comes up, and Bootstrap is CSS-class-driven enough not to need dedicated study time.
- PostHog, beyond noting it as a personal interest to revisit after the assignment is behind us.
- Any attempt to guess or pre-build the actual assignment — nothing here should be assignment-specific since the real instructions haven't arrived yet. This is stack familiarity, not answer-guessing.

## Further Notes

**On CommuApp's decision-doc workflow:** Ronnie mentioned in the interview that CommuApp keeps markdown spec files that help guide (agent-assisted, it sounds like) decisions on when to use REST versus GraphQL. If the actual assignment includes something similar, the cheat sheet built in Block 2 should already cover the reasoning even if the exact document looks different. Worth reading whatever real spec they provide carefully before writing a line of code, rather than defaulting to instinct.

**On risk if time runs short:** if Sunday runs behind schedule, protect Block 1 (Laravel) and Block 2 (GraphQL/Apollo) first — those are the two highest-weight, highest-gap items per the priority ranking. Block 3 (Expo/Pusher) and Block 4 (Sentry) can be trimmed or dropped without much risk, since Expo/navigation fundamentals already have some real footing and Sentry has a small, forgiving surface area to pick up quickly even during the assignment itself if needed.

**On mindset for the assignment itself:** the interview and Ronnie's follow-up email both frame this as measuring "understanding endpoints, graphql etc," not measuring PHP fluency built over a weekend. Realistically, the fastest path to a good outcome is being able to read CommuApp's actual schema and codebase quickly and reason clearly about it out loud (in comments, in a README, in commit messages) — not pretending three years of Laravel experience exists. Two days of hands-on exposure gets pattern-recognition, not fluency, and that's the honest goal here.
