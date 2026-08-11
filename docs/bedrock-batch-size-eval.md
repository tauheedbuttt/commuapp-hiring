# Bedrock batch-size eval

`SUMMARY_NOTICE_BATCH_COUNT` (N) controls how many recent notices get fetched and fed into the Bedrock prompt for the area summary. It started as a round-number guess, 30, never measured. This doc is that measurement.

## Method

For each of the four task towns (Helsinki, Vantaa, Tampere, Turku):

1. Geocode the town once via the existing Nominatim path.
2. Fetch notices once at `first: 100`, `distanceMeters: 15000`, `page: 1`, ordered `CREATED_AT DESC`. Same fetch reused for every N below, so a town's N=5 and N=100 slices come from the identical notice set, just truncated differently. No separate live fetch per N.
3. For N in `{5, 10, 20, 30, 50, 100}`, trim the first N notices the same way `AreaSummaryService::trimNotice()` does, then call Bedrock's Converse API directly with the same prompt `BedrockSummaryGenerator` builds. Recorded input tokens, output tokens, wall-clock latency, and the summary text off the raw response, bypassing the summary/notice cache entirely so every call hit Bedrock live.

Distance stayed fixed at 15000m project-wide, only N varied. Model stayed Nova Lite (`eu.amazon.nova-2-lite-v1:0`), no model comparison, that's out of scope for this eval.

Turku only had 41 notices available near it, so N=50 and N=100 both resolve to the same 41-notice slice, one data point, not two.

Ran live against real AWS Bedrock and the real Commu API. 23 Converse calls total, all in one sitting since the Commu bearer token had roughly an hour of life left.

## Results

| Town | N | Notices used | Input tokens | Output tokens | Latency (ms) |
|---|---|---|---|---|---|
| Helsinki | 5 | 5 | 1198 | 49 | 930 |
| Helsinki | 10 | 10 | 2200 | 49 | 851 |
| Helsinki | 20 | 20 | 5516 | 56 | 911 |
| Helsinki | 30 | 30 | 8704 | 59 | 1313 |
| Helsinki | 50 | 50 | 18469 | 49 | 1314 |
| Helsinki | 100 | 100 | 38441 | 55 | 2077 |
| Vantaa | 5 | 5 | 1392 | 59 | 947 |
| Vantaa | 10 | 10 | 2316 | 54 | 759 |
| Vantaa | 20 | 20 | 6092 | 67 | 1455 |
| Vantaa | 30 | 30 | 8843 | 47 | 1146 |
| Vantaa | 50 | 50 | 18961 | 64 | 1965 |
| Vantaa | 100 | 100 | 36090 | 56 | 2690 |
| Tampere | 5 | 5 | 1066 | 48 | 758 |
| Tampere | 10 | 10 | 2429 | 65 | 827 |
| Tampere | 20 | 20 | 5335 | 63 | 1118 |
| Tampere | 30 | 30 | 6622 | 66 | 1203 |
| Tampere | 50 | 50 | 14585 | 50 | 1288 |
| Tampere | 100 | 100 | 32002 | 60 | 2151 |
| Turku | 5 | 5 | 901 | 41 | 712 |
| Turku | 10 | 10 | 2131 | 61 | 921 |
| Turku | 20 | 20 | 5133 | 56 | 1018 |
| Turku | 30 | 30 | 8355 | 61 | 1216 |
| Turku | 50/100 | 41 (town ran out) | 11508 | 61 | 1334 |

Output tokens barely move across the whole sweep, 41 to 67 regardless of N. The model always writes roughly the same 2-sentence length. Input tokens scale with N close to linearly, so cost and latency both keep climbing well past the point where the summary itself stops changing.

## Where the summary stops changing

Read all four towns' summary text side by side per N (full text is in each run's Converse response, not reproduced here, only the pattern):

- N=5 and N=10: text is thin, grabs whatever's in the first handful of notices, sailing lessons, dog treats, one-off items. Themes shift noticeably between the two.
- N=20: better coverage but still catches town-specific one-offs (Vantaa's N=20 mentions "public speaking" and "cleaning for the elderly", themes that vanish again at N=30). Not yet stable.
- N=30: all four towns land on a consistent theme here, transportation/housework/companionship-style needs paired with pet care/IT support/volunteering-style offers, and that theme holds unchanged through N=50 and N=100. Wording shifts call to call (the model isn't deterministic), substance doesn't.
- N=50 and N=100: same themes as N=30, just 2-4x the input tokens and noticeably higher latency (1.3s at N=30 versus 2-2.7s at N=100) for no new information in the output.

Vantaa and Tampere are the clearest cases, both show real thematic drift from N=20 to N=30, then flatten out completely from N=30 onward. Helsinki and Turku converge a bit earlier but aren't worse off at N=30.

## Decision

Kept `SUMMARY_NOTICE_BATCH_COUNT=30`. Wasn't expecting the original guess to hold up, but the data backs it, N=30 is the point where the summary's substance stabilizes across all four towns and stays stable through N=50 and N=100. Going lower to N=20 would save maybe 30-40% of input tokens but risks catching a less representative theme, two of four towns hadn't settled yet at N=20. Going higher buys nothing, output text is identical in substance, just more tokens and up to 2x the latency at N=100 versus N=30.

Raw per-call data (including full summary text) was dumped to `storage/eval-batch-size-results.json` during the run and not committed, it's throwaway output from a throwaway eval script.
