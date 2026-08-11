<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'nominatim' => [
        'base_url' => env('NOMINATIM_BASE_URL'),
        'user_agent' => env('NOMINATIM_USER_AGENT'),
    ],

    'geocode_cache' => [
        'ttl_seconds' => env('GEOCODE_CACHE_TTL_SECONDS'),
    ],

];
