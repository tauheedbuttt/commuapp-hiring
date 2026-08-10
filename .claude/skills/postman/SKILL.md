---
name: postman
description: Generate Postman collection JSON for all GraphQL ops in backend/graphql/schema.graphql. Trigger: /postman
---

Give user Postman collection JSON, chat only, no file write. User pastes it straight into Postman import.

## Steps

1. Read `backend/graphql/schema.graphql`. Fresh read every time — no cached/stale copy, schema grows.
2. Pull every field under `type Query` and `type Mutation`. Skip types, enums, scalars — ops only.
3. Build Postman Collection v2.1.0 JSON:
   - `info.schema`: `https://schema.getpostman.com/json/collection/v2.1.0/collection.json`
   - collection var `BASE_URL`, value blank or `http://127.0.0.1:8000` as placeholder — request URL always `{{BASE_URL}}/graphql`, never literal localhost.
   - one request per op. Method `POST`. No manual `Content-Type` header — Postman's `graphql` body mode sets it.
   - body mode `graphql`, native Postman GraphQL body:
     ```json
     "body": {
       "mode": "graphql",
       "graphql": {
         "query": "query($town: String!) {\n  geocodeTown(town: $town) {\n    town\n    latitude\n    longitude\n  }\n}",
         "variables": "{\n  \"town\": \"\"\n}"
       }
     }
     ```
   - `query`: full op with all args as GraphQL variables, all scalar fields of return type selected. Nested object fields expand one level.
   - `variables`: NOT a JSON object — a JSON-stringified string, one key per arg, always present by default (never omitted even if op takes zero args → `"{}"`). Placeholder value matching arg's GraphQL type (String → `""`, Int → `0`, Float → `0.0`, ID → `"1"`, Boolean → `false`).
   - request name = op name.
4. Output raw JSON in a fenced code block. Nothing else wrapping it — no explanation needed unless user asks.
5. New op added to schema later → re-run whole thing, not a diff/patch.
