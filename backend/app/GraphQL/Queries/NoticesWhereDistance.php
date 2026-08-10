<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Services\Commu\NoticeSearchService;

final class NoticesWhereDistance
{
    public function __construct(
        private readonly NoticeSearchService $noticeSearch,
    ) {}

    /** @param  array{latitude: float, longitude: float, distance: int, first: int, page: int|null}  $args */
    public function __invoke(mixed $rootValue, array $args): array
    {
        return $this->noticeSearch->searchNearby(
            latitude: $args['latitude'],
            longitude: $args['longitude'],
            distanceMeters: $args['distance'],
            first: $args['first'],
            page: $args['page'] ?? null,
        );
    }
}
