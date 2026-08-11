<?php

declare(strict_types=1);

namespace App\Services\Commu;

/**
 * Shared mapping helpers for the Notice shapes both NoticeSearchService and
 * NoticeDetailService trim down to plain arrays. The Sailor-generated
 * position/category classes for each operation are structurally identical
 * but distinct PHP classes (Sailor generates one set per operation), so
 * these accept untyped objects rather than a shared interface that doesn't
 * exist.
 */
final class NoticeFieldMapper
{
    /** @return array{latitude: float, longitude: float} */
    public static function position(object $position): array
    {
        return [
            'latitude' => $position->latitude,
            'longitude' => $position->longitude,
        ];
    }

    /** @return array{main: array{id: mixed, key: string}|null, sub: list<array{id: mixed, key: string}>} */
    public static function categories(object $categories): array
    {
        return [
            'main' => $categories->main === null ? null : [
                'id' => $categories->main->id,
                'key' => $categories->main->key,
            ],
            'sub' => self::nonNullList($categories->sub, static fn ($category) => [
                'id' => $category->id,
                'key' => $category->key,
            ]),
        ];
    }

    /**
     * Drops null entries (Sailor types list items as nullable even when the
     * upstream field isn't), then maps and re-indexes what's left.
     *
     * @param  array<int, object|null>|null  $items
     * @param  callable(object): array<string, mixed>  $mapper
     * @return list<array<string, mixed>>
     */
    public static function nonNullList(?array $items, callable $mapper): array
    {
        if ($items === null) {
            return [];
        }

        return array_values(array_map($mapper, array_filter($items, static fn ($item) => $item !== null)));
    }
}
