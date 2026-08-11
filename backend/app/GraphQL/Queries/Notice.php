<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Services\Commu\NoticeService;

final class Notice
{
    public function __construct(
        private readonly NoticeService $notices,
    ) {}

    /** @param  array{id: string, lat: float|null, long: float|null}  $args */
    public function __invoke(mixed $rootValue, array $args): array
    {
        return $this->notices->find(
            id: $args['id'],
            latitude: $args['lat'] ?? null,
            longitude: $args['long'] ?? null,
        );
    }
}
