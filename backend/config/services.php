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

    'bedrock' => [
        'model_id' => env('BEDROCK_MODEL_ID'),
        'region' => env('BEDROCK_AWS_REGION'),
    ],

    'summary' => [
        'cache_ttl_seconds' => env('SUMMARY_CACHE_TTL_SECONDS'),
        'notice_batch_cache_ttl_seconds' => env('NOTICE_BATCH_CACHE_TTL_SECONDS'),
        'notice_batch_count' => env('SUMMARY_NOTICE_BATCH_COUNT'),
        'min_notices' => env('SUMMARY_MIN_NOTICES'),
    ],

];
