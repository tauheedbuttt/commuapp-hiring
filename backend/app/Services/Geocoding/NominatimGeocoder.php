<?php

declare(strict_types=1);

namespace App\Services\Geocoding;

use App\Enums\CacheKeysEnum;
use App\Enums\ErrorCategory;
use App\Exceptions\GraphQLClientException;
use App\Services\Cache\FailOpenCache;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

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
        $cached = $this->cache->get(CacheKeysEnum::Geocode, $town);

        if ($cached !== null) {
            $cached['town'] = $town;

            return $cached;
        }

        $result = $this->fetch($town);
        $this->cache->remember(CacheKeysEnum::Geocode, $result, $town);
        $result['town'] = $town;

        return $result;
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
