<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Services\Geocoding\NominatimGeocoder;

final class GeocodeTown
{
    public function __construct(
        private readonly NominatimGeocoder $geocoder,
    ) {}

    /** @param  array{town: string}  $args */
    public function __invoke(mixed $rootValue, array $args): array
    {
        return $this->geocoder->geocode($args['town']);
    }
}
