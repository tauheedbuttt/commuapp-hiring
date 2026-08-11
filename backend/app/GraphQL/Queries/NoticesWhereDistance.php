<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Services\Commu\NoticeSearchService;

final class NoticesWhereDistance
{
    public function __construct(
        private readonly NoticeSearchService $noticeSearch,
    ) {}

    /** @param  array{lat: float, long: float, distance: int, first: int, page: int|null}  $args */
    public function __invoke(mixed $rootValue, array $args): array
    {
        return $this->noticeSearch->searchNearby(
            latitude: $args['lat'],
            longitude: $args['long'],
            distanceMeters: $args['distance'],
            first: $args['first'],
            page: $args['page'] ?? null,
        );
    }
}
