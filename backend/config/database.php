<?php

/*
 * Only the `redis` connections are defined here — this app has no SQL
 * database, so the rest of Laravel's stock `database.php` was stripped.
 * The key must stay `database.php`/`redis` because Laravel's RedisManager
 * reads `config('database.redis')` unconditionally.
 */
return [

    'redis' => [
        'client' => env('REDIS_CLIENT'),

        'cache' => [
            'host' => env('REDIS_HOST'),
            'password' => env('REDIS_PASSWORD'),
            'port' => env('REDIS_PORT'),
            'database' => env('REDIS_CACHE_DB'),
        ],
    ],

];
