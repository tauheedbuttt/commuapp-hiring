# Notice schema — cheat sheet

Full schema in `docs/graphql-schema.graphql` (SDL) and `docs/graphql-schema.json` (raw introspection). Both huge, most of it irrelevant to this task. This file: only the `Notice` / `notice*` slice, pulled straight from those two files, for the help-post feature in `docs/task.md`.

Notice = Help Post. Same entity, `Notice` in API, "Help Post" in product copy.

## Which query to use

Six `notice*` queries on `Query`. Only one fits "nearby posts from lat/long":

| Query | Filter shape | Auth | Notes |
|---|---|---|---|
| `notice(id, distanceToPoint)` | single ID | — | fetch one, not a search |
| `noticesWhereLocation` | bounding box (`longMax/longMin/latMax/latMin`) | requires login (`@customGuard`) | box, not radius; no pagination, returns raw `[Notice]!` |
| `noticesWhereLocationFiltered` | `NoticeSearch` box + filters | none required | public-embed use case |
| `noticesByQueryWord` | free text + optional lat/long/`maxDistanceToUser` | none required | keyword search, distance is a side filter not primary |
| `popularNotices` | optional lat/long, popularity-ranked | requires login | ranking algo not distance |
| **`noticesWhereDistance`** | **`lat`, `long`, `distance` (radius)** | requires login | paginated, purpose-built radius search |

**Pick `noticesWhereDistance`.** It's the only one built around "radius from a point," which is exactly the geocoded-town flow. Everything else is a bounding box, a keyword search, or a popularity ranking wearing a location filter as a side dish.

```graphql
query NoticesNearby($lat: Float!, $long: Float!, $distance: Int!, $first: Int) {
  noticesWhereDistance(lat: $lat, long: $long, distance: $distance, first: $first) {
    paginatorInfo { count hasMorePages }
    data {
      id
      title
      description
      type
      side
      created_at
      position { latitude longitude }
      categories { main { key } sub { key } }
      distance_to_user
    }
  }
}
```

Caveat found in the schema itself: `noticesWhereDistance`'s `orderBy` only accepts `QueryNoticesWhereDistanceOrderByColumn` = `CREATED_AT`. You cannot ask the server to sort by distance, despite the field existing on `Notice` (`distance_to_user: Float`). If "recent" needs to also mean "closest," sort client-side after fetch, don't fight the API for it.

Full signature:

```graphql
noticesWhereDistance(
  distance: Int!
  lat: Float!
  long: Float!
  orderBy: [QueryNoticesWhereDistanceOrderByOrderByClause!]
  types: [NoticeType]
  omitCategories: [String]        # deprecated, use categorySelection
  categorySelection: [ReversableCategorySelection]
  themes: [ID]
  first: Int! = 50
  page: Int
): NoticePaginator!
```

Requires auth — same bearer token as everything else, sent server-side only. Defaults to 50/page, standard offset pagination (`first`/`page`), no cursor.

## Notice type

```graphql
type Notice {
  id: ID!
  title: String!
  description: String
  owner: User
  categories: NoticeCategories!
  created_at: DateTime!
  updated_at: DateTime!
  expires_at: DateTime
  deleted_at: DateTime
  start_date: DateTime
  end_date: DateTime
  image: Asset
  internal: Team
  type: NoticeType!
  side: NoticeSide
  parents: [Notice]
  children: [Notice]
  levels: [Notice]
  notice_language_versions: [NoticeTranslation]
  position: NoticePosition!
  content: NoticeContent          # shape depends on `type`
  cid: Int
  meta: NoticeMeta
  metaRaw: String
  company: Company
  employeeProfile: EmployeeProfile
  company_id: ID
  employee_id: ID
  in_return: String
  needs_professional: Boolean
  noticeViews: Int
  distance_to_user: Float
  is_expired: Boolean
  likes: Int
  deals: [Deal]
  theme: Theme
  userInvite: UserInvite
  registration_closed_hours_before: Int
  gives_count: Int
  needs_count: Int
  invite_id: ID
  format: String
  remote: String

  # deprecated, skip these:
  # category: String            -> use categories
  # sub_categories: [String]    -> use categories
}
```

### Fields worth actually selecting for this task

For "list of help posts + summarize what kinds of help are requested":

- `id`, `title`, `description` — the content itself, what the LLM summary is built from
- `type`, `side` — GIVE vs NEED, and which of the 8 sub-types (drives "mostly X, some Y" phrasing)
- `categories { main { key } sub { key } }` — structured category, cheaper/more reliable to bucket than parsing free text
- `created_at` — for "how many results count as recent"
- `position { latitude longitude }` — you already searched by radius, but useful if the app wants to show a map or re-verify distance
- `distance_to_user` — populated when you search by point; use for client-side distance sort/display

Skip unless there's a reason: `deals`, `userInvite`, `noticeViews`, `likes`, `parents/children/levels` (hierarchy stuff, not relevant here), `metaRaw`, `format`, `remote`, `registration_closed_hours_before`, `gives_count`/`needs_count` (these look aggregate/org-level, not per-notice help signal).

## Supporting types

```graphql
type NoticeCategories {
  schema_version: Int!
  main: Category
  sub: [Category]!
}

type Category {
  id: ID
  key: String!
  subCategories: [Category]!
  parent: Category
  meta: String
  themes: [Theme]!
}

type NoticePosition {
  latitude: Float!
  longitude: Float!
  level: String!
}

enum NoticeSide {
  GIVE
  NEED
}

enum NoticeType {
  GIVE_SELL
  GIVE_TRADE
  GIVE_FREE
  GIVE_GENERIC
  NEED_BUY
  NEED_TRADE
  NEED_FREE
  NEED_GENERIC
  COLLECTOR
}
```

`content: NoticeContent` is a union, shape follows `type`:

```graphql
union NoticeContent = GiveSellContent | GiveTradeContent | NeedBuyContent | NeedTradeContent | OtherContent

type GiveSellContent   { price: Float! }
type GiveTradeContent  { preferred: String }     # what they want in return
type NeedBuyContent    { price_estimation: Float!, range: Float }
type NeedTradeContent  { offers: String! }        # what they'll give in return
type OtherContent      { empty_description: String }  # GIVE_FREE / NEED_FREE / *_GENERIC / COLLECTOR land here
```

Only worth querying if the summary needs to mention price/trade terms — for a plain "what's being asked for around here" summary, `title`+`description`+`type`+`categories` already carries that.

```graphql
"""Paginated wrapper noticesWhereDistance returns"""
type NoticePaginator {
  paginatorInfo: PaginatorInfo!
  data: [Notice!]!
}

type PaginatorInfo {
  count: Int!
  currentPage: Int!
  hasMorePages: Boolean!
  # (see full schema for remaining paginator fields)
}
```

## Distance / radius decision

`distance: Int!` on `noticesWhereDistance` — no documented unit in the schema itself, but `docs/brainstorming/Preferences.png` (the app's own Preferences screen) shows a "Max distance" slider labeled in km, defaulting to 20km. Confirms the unit and gives a sane default to start from — no need to guess or reverse-engineer it against the test towns.

Also worth knowing: `User.preferred_distance: Int` already exists on the `User` type. That's presumably the field backing that same slider server-side — a signal the API already has a notion of "user's preferred search radius" independent of whatever this task builds.

## Preferences screen → what's already in the API for it

`docs/brainstorming/Preferences.png` shows a Preferences screen with a distance slider and a reorderable list of three "help post widgets": Latest posts. Not building this flow here — just noting which existing queries/fields could back each one, for later.

**Reconsidered:** Only show Latest Posts.

**Latest posts** — `noticesWhereDistance`, the same query already picked above, ordered by the one sortable column it has (`CREATED_AT`, `DESC`). No extra API needed, this is the default case.

## Auth reminder

Every `notice*` query here needs the bearer token — backend-only, never forwarded to the Expo app (see `docs/task.md`, "Authentication" section). Token expires ~1hr; if `noticesWhereDistance` starts 401ing mid-dev, that's why, not a schema issue.

## Help Post Detail page (`docs/brainstorming/help-detail-page-1.png`, `-2.png`, `-3.png`)

Single-post view, opened from a card on the home list. Every UI element mapped to a field/mutation below; gaps called out where the API doesn't have a clean answer.

### Query — single notice by id

```graphql
query NoticeDetail($id: ID!) {
  notice(id: $id) {
    id
    title
    description
    in_return
    side
    type
    created_at
    distance_to_user
    likes
    image { url }
    position { latitude longitude }
    categories { main { key } sub { key } }
    owner {
      id
      name
      avatar_url
      trust_level
      accountVerifications { type completed_at }
    }
    company { id name logo_url }
    notice_language_versions { title description in_return language }
  }
}
```

`notice(id, distanceToPoint)` is the right query here (see table above) — pass the user's current point as `distanceToPoint` to get `distance_to_user` populated same as the list view.

### Field-by-field

| Screen element | Field / action | Notes |
|---|---|---|
| Title | `title` | Original-language text (`"Hiusten leikkuu ja pesu"` = Finnish in mock) |
| Auto-translate toggle | — | **Gap.** No translate-notice mutation exists (only `translatedChatMessage` for chat messages). `notice_language_versions` gives *author-provided* translations if the poster filled them in, not on-the-fly MT. If auto-translate must work for any post regardless of author input, this needs either a new backend mutation or a client-side translation call. |
| Main image | `image { url }` | — |
| "Offer help" pill | `side` | `GIVE`/`NEED` enum → UI label. Poster is offering their skill, so this is `GIVE` mapped to "Offer help"; confirm exact label mapping for all 4 combos (`GIVE`→?, `NEED`→?) against product copy. |
| "Other" pill | `categories.main.key` | Category key, not free text |
| Owner name + avatar | `owner.name`, `owner.avatar_url` | — |
| "User credibility: Awesome" + shield badge | `owner.trust_level` (Int) + `owner.accountVerifications` | **Gap.** `trust_level` is an untyped int — no enum/threshold documented anywhere in the schema for what maps to "Awesome". Shield badge is presumably "has a completed verification" (`accountVerifications` non-empty / specific `type`), but which verification `type` qualifies isn't documented either. Needs a backend SME answer before FE can build this row. |
| Distance | `distance_to_user` | Blank in the mock screenshot — likely just a placeholder state, not a schema issue |
| Created | `created_at` | — |
| Like count (heart, `8`) | `likes` (Int, read) / `likeNotice(id: ID!): Boolean` (mutation, write) | No `is_liked_by_user`-style flag on `Notice` (unlike `Goal.liked_by_user`, which does have one) — **gap**: FE can't tell if the current user already liked this post without tracking it locally or checking `owner.likedNotices` — wait, that's on `User` for the current viewer, i.e. `me { likedNotices { id } }`. Cross-reference client-side against `me.likedNotices` if needed. |
| Share | — | No API involved, client-side share sheet with a deep link |
| Save (bookmark) | `addOrRemoveAsFavorite(id: ID!): Favorite` | Toggle mutation, no separate check/uncheck. Same "am I currently saved" gap as likes — check against `me { favorites { notice { id } } }` client-side if a filled-vs-empty bookmark icon is needed on load |
| Report | `createUserReport(input: UserReportInput!)` | `input: { reported: { connect: owner.id }, notice: { connect: id }, reason: "..." }` — `reason` presumably comes from a follow-up reason picker, not shown in this mock |
| Description | `description` | — |
| "Asked in return: Yes" + text | `in_return` | Presence of non-empty `in_return` ⇒ "Yes" row shown with that text; null/empty ⇒ presumably hide the row or show "No". Confirm the empty-string vs null distinction with backend. |
| Location map pin | `position { latitude longitude }` | — |
| Similar Help posts cards | title, image, `company { name logo_url }`, `categories.main.key`, `distance_to_user` | **Gap.** No dedicated "similar posts" query. Closest fit: reuse `noticesWhereDistance` (already the pick for the list screen) filtered by `categorySelection` matching this post's `categories.main`, near this post's `position`, small `first` (e.g. 4-6) — then drop the current post's own id client-side, since none of the `notices*` queries support an "exclude id" filter. |
| "Open chat" sticky button | `createChat(input: CreateChatInput!)` with `input: { notice: { connect: id } }` | Check `chatsByNotice(noticeId: ID!)` first to reuse an existing chat thread instead of always creating a new one |

### Open questions for backend/product before build

1. `trust_level` int → "Awesome" label mapping (thresholds/enum) — not in the schema.
2. Which `AccountVerification.type` value(s) light up the shield badge.
3. Exact GIVE/NEED × pill-label mapping for all 4 `side`/`type` combos, not just the one in this mock.
4. Whether "similar posts" should be same-category, same-org, or something else — the mock's two examples are both from the same org ("SVK Liitto ry"), which category-only filtering wouldn't guarantee.
5. Auto-translate: real MT call, or reliant on `notice_language_versions` being populated by the author.
