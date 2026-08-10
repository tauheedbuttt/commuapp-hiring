<?php

declare(strict_types=1);

namespace App\Services\Cache;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * Wraps the cache store so a Redis outage degrades performance, not
 * availability: a read or write failure logs and falls through to the
 * live path instead of failing the caller's request.
 */
class FailOpenCache
{
    public function remember(string $key, int $ttlSeconds, \Closure $resolve): mixed
    {
        try {
            $cached = Cache::get($key);
        } catch (\Throwable $e) {
            Log::warning('Cache read failed, falling back to live path.', [
                'key' => $key,
                'exception' => $e->getMessage(),
            ]);

            return $resolve();
        }

        if ($cached !== null) {
            return $cached;
        }

        $value = $resolve();

        try {
            Cache::put($key, $value, $ttlSeconds);
        } catch (\Throwable $e) {
            Log::warning('Cache write failed, continuing without caching this result.', [
                'key' => $key,
                'exception' => $e->getMessage(),
            ]);
        }

        return $value;
    }
}
