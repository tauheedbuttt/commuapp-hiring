<?php

declare(strict_types=1);

namespace App\Services\Cache;

use App\Enums\CacheKeysEnum;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Wraps the cache store so a Redis outage degrades performance, not
 * availability: a read or write failure logs and returns as if the entry
 * were simply absent, so callers fall through to their live path.
 *
 * Callers never build key strings or look up TTLs themselves — each
 * `CacheKeysEnum` case is registered once below with its key-gen function
 * and TTL, keyed off config.
 */
class FailOpenCache
{
    /** @var array<string, array{key: \Closure, ttl: \Closure}> */
    private readonly array $registry;

    public function __construct()
    {
        $this->registry = [
            CacheKeysEnum::Geocode->value => [
                'key' => fn (string $town): string => 'geocode:'.Str::lower(trim($town)),
                'ttl' => fn (): int => (int) config('services.geocode_cache.ttl_seconds'),
            ],
            CacheKeysEnum::AreaSummary->value => [
                'key' => fn (string $town, int $distance): string => 'summary:'.Str::lower(trim($town)).':'.$distance,
                'ttl' => fn (): int => (int) config('services.summary.cache_ttl_seconds'),
            ],
            CacheKeysEnum::NoticeBatch->value => [
                'key' => fn (string $town, int $distance): string => 'notice_batch:'.Str::lower(trim($town)).':'.$distance,
                'ttl' => fn (): int => (int) config('services.notice_batch.cache_ttl_seconds'),
            ],
        ];
    }

    public function get(CacheKeysEnum $key, mixed ...$params): mixed
    {
        $cacheKey = $this->buildKey($key, $params);

        try {
            return Cache::get($cacheKey);
        } catch (\Throwable $e) {
            Log::warning('Cache read failed, falling back to live path.', [
                'key' => $key->value,
                'exception' => $e->getMessage(),
            ]);

            return null;
        }
    }

    public function remember(CacheKeysEnum $key, mixed $value, mixed ...$params): void
    {
        $cacheKey = $this->buildKey($key, $params);
        $ttlFn = $this->registry[$key->value]['ttl'];
        $ttl = $ttlFn();

        try {
            Cache::put($cacheKey, $value, $ttl);
        } catch (\Throwable $e) {
            Log::warning('Cache write failed, continuing without caching this result.', [
                'key' => $key->value,
                'exception' => $e->getMessage(),
            ]);
        }
    }

    /** @param list<mixed> $params */
    private function buildKey(CacheKeysEnum $key, array $params): string
    {
        $keyFn = $this->registry[$key->value]['key'];

        return $keyFn(...$params);
    }
}
