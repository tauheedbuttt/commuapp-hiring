<?php

declare(strict_types=1);

namespace App\Services\Geocoding;

use App\Enums\ErrorCategory;
use App\Exceptions\GraphQLClientException;
use App\Services\Cache\FailOpenCache;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

/**
 * Resolves a town name to coordinates via the Nominatim (OpenStreetMap)
 * geocoding API. No GraphQL knowledge — reusable/swappable independently
 * of the GraphQL layer.
 */
class NominatimGeocoder
{
    private const TIMEOUT_SECONDS = 5;

    public function __construct(
        private readonly FailOpenCache $cache,
    ) {}

    /** @return array{town: string, latitude: float, longitude: float} */
    public function geocode(string $town): array
    {
        $key = 'geocode:'.Str::lower(trim($town));
        $ttl = (int) config('services.geocode_cache.ttl_seconds');

        return $this->cache->remember($key, $ttl, fn () => $this->fetch($town));
    }

    /** @return array{town: string, latitude: float, longitude: float} */
    private function fetch(string $town): array
    {
        try {
            $response = Http::withHeaders([
                'User-Agent' => config('services.nominatim.user_agent'),
            ])
                ->timeout(self::TIMEOUT_SECONDS)
                ->get(config('services.nominatim.base_url'), [
                    'q' => $town,
                    'format' => 'json',
                    'limit' => 1,
                ]);
        } catch (ConnectionException) {
            throw new GraphQLClientException(
                'Could not reach the geocoding service.',
                ErrorCategory::Upstream,
            );
        }

        if ($response->failed()) {
            throw new GraphQLClientException(
                'The geocoding service returned an error.',
                ErrorCategory::Upstream,
            );
        }

        $results = $response->json();

        if (empty($results)) {
            throw new GraphQLClientException(
                "No location found for \"{$town}\".",
                ErrorCategory::NotFound,
            );
        }

        $match = $results[0];

        return [
            'town' => $town,
            'latitude' => (float) $match['lat'],
            'longitude' => (float) $match['lon'],
        ];
    }
}
