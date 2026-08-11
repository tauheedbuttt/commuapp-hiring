<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Services\Summary\AreaSummaryService;

final class AreaSummary
{
    public function __construct(
        private readonly AreaSummaryService $summary,
    ) {}

    /** @param  array{town: string, lat: float, long: float, distance: int}  $args */
    public function __invoke(mixed $rootValue, array $args): array
    {
        return $this->summary->generate(
            town: $args['town'],
            latitude: $args['lat'],
            longitude: $args['long'],
            distanceMeters: $args['distance'],
        );
    }
}
