<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Services\Commu\NoticeDetailService;

final class Notice
{
    public function __construct(
        private readonly NoticeDetailService $noticeDetail,
    ) {}

    /** @param  array{id: string, lat: float|null, long: float|null}  $args */
    public function __invoke(mixed $rootValue, array $args): array
    {
        return $this->noticeDetail->find(
            id: $args['id'],
            latitude: $args['lat'] ?? null,
            longitude: $args['long'] ?? null,
        );
    }
}
