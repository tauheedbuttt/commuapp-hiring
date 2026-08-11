<?php

declare(strict_types=1);

namespace App\Services\Commu;

/**
 * Maps the Sailor-generated Notice shapes NoticeService's two upstream
 * calls (searchNearby, find) return down to this app's plain-array
 * response shapes. The Sailor-generated classes for each operation are
 * structurally identical but distinct PHP classes (Sailor generates one
 * set per operation), so these accept untyped objects rather than a
 * shared interface that doesn't exist.
 */
final class NoticeFieldMapper
{
    /** @return array<string, mixed> */
    public static function searchListItem(object $notice): array
    {
        return [
            'id' => $notice->id,
            'title' => $notice->title,
            'description' => $notice->description,
            'type' => $notice->type,
            'side' => $notice->side,
            'created_at' => $notice->created_at,
            'distance_to_user' => $notice->distance_to_user,
            'position' => self::position($notice->position),
            'categories' => self::categories($notice->categories),
            'image' => $notice->image === null ? null : [
                'url' => $notice->image->url,
            ],
            'owner' => $notice->owner === null ? null : [
                'id' => $notice->owner->id,
                'name' => $notice->owner->name,
                'avatar_url' => $notice->owner->avatar_url,
            ],
            'company' => $notice->company === null ? null : [
                'id' => $notice->company->id,
                'name' => $notice->company->name,
                'logo_url' => $notice->company->logo_url,
            ],
        ];
    }

    /** @return array<string, mixed> */
    public static function detail(object $notice): array
    {
        return [
            'id' => $notice->id,
            'title' => $notice->title,
            'description' => $notice->description,
            'in_return' => $notice->in_return,
            'type' => $notice->type,
            'side' => $notice->side,
            'created_at' => $notice->created_at,
            'expires_at' => $notice->expires_at,
            'distance_to_user' => $notice->distance_to_user,
            'likes' => $notice->likes,
            'image' => $notice->image === null ? null : [
                'url' => $notice->image->url,
            ],
            'position' => self::position($notice->position),
            'categories' => self::categories($notice->categories),
            'owner' => $notice->owner === null ? null : [
                'id' => $notice->owner->id,
                'name' => $notice->owner->name,
                'avatar_url' => $notice->owner->avatar_url,
                'trust_level' => $notice->owner->trust_level,
                'accountVerifications' => self::nonNullList($notice->owner->accountVerifications, static fn ($verification) => [
                    'type' => $verification->type,
                    'completed_at' => $verification->completed_at,
                ]),
            ],
            'company' => $notice->company === null ? null : [
                'id' => $notice->company->id,
                'name' => $notice->company->name,
                'logo_url' => $notice->company->logo_url,
            ],
            'notice_language_versions' => self::nonNullList($notice->notice_language_versions, static fn ($translation) => [
                'title' => $translation->title,
                'description' => $translation->description,
                'in_return' => $translation->in_return,
                'language' => $translation->language,
            ]),
        ];
    }

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
