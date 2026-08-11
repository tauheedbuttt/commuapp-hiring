<?php


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
