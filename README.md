# commuapp-hiring

Laravel backend + Expo mobile app. User enters a home town, sees nearby help posts plus a generated area summary.

## Setup

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
```

Run:

```bash
php artisan serve
```

GraphQL endpoint: `POST http://127.0.0.1:8000/graphql`. See `backend/README.md` for query examples and error shape.

### Mobile app (Expo)

_Not built yet._

## Decisions

### API format (REST vs GraphQL vs other)

_TBD_

### Geocoding API

_TBD_

### `notice*` query chosen

_TBD_

### Search distance

_TBD_

### `Notice` fields selected

_TBD_

### Caching approach

_TBD_

### Bedrock model & summary approach

_TBD_

## How this was implemented

_TBD_

## What I'd improve next

_TBD_
