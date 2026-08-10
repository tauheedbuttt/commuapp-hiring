<?php

declare(strict_types=1);

namespace App\Services\Commu;

use App\Enums\ErrorCategory;
use App\Exceptions\GraphQLClientException;
use App\Services\Commu\Generated\Operations\NoticesWhereDistance as NoticesWhereDistanceOperation;
use App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Notice;
use App\Services\Commu\Generated\Types\QueryNoticesWhereDistanceOrderByColumn;
use App\Services\Commu\Generated\Types\QueryNoticesWhereDistanceOrderByOrderByClause;
use App\Services\Commu\Generated\Types\SortOrder;
use Spawnia\Sailor\Error\ResultErrorsException;

/**
 * Fetches nearby help posts from the upstream Commu API via the
 * schema-generated Sailor client. No GraphQL knowledge of our own
 * schema — returns plain arrays trimmed to the fields this app needs.
 */
class NoticeSearchService
{
    /** @return array{notices: list<array<string, mixed>>, count: int, currentPage: int, hasMorePages: bool} */
    public function searchNearby(float $latitude, float $longitude, int $distanceMeters, int $first, ?int $page): array
    {
        try {
            $result = NoticesWhereDistanceOperation::execute(
                lat: $latitude,
                long: $longitude,
                distance: $distanceMeters,
                first: $first,
                page: $page,
                orderBy: [QueryNoticesWhereDistanceOrderByOrderByClause::make(
                    column: QueryNoticesWhereDistanceOrderByColumn::CREATED_AT,
                    order: SortOrder::DESC,
                )],
            );
        } catch (\Throwable) {
            throw new GraphQLClientException(
                'Could not reach the Commu service.',
                ErrorCategory::Upstream,
            );
        }

        try {
            $data = $result->errorFree()->data;
        } catch (ResultErrorsException) {
            throw new GraphQLClientException(
                'The Commu service returned an error.',
                ErrorCategory::Upstream,
            );
        }

        $paginator = $data->noticesWhereDistance;

        return [
            'notices' => array_map($this->mapNotice(...), $paginator->data),
            'count' => $paginator->paginatorInfo->total,
            'currentPage' => $paginator->paginatorInfo->currentPage,
            'hasMorePages' => $paginator->paginatorInfo->hasMorePages,
        ];
    }

    /** @return array<string, mixed> */
    private function mapNotice(Notice $notice): array
    {
        return [
            'id' => $notice->id,
            'title' => $notice->title,
            'description' => $notice->description,
            'type' => $notice->type,
            'side' => $notice->side,
            'createdAt' => $notice->created_at,
            'distanceMeters' => $notice->distance_to_user,
            'position' => [
                'latitude' => $notice->position->latitude,
                'longitude' => $notice->position->longitude,
            ],
            'category' => [
                'main' => $notice->categories->main === null ? null : [
                    'id' => $notice->categories->main->id,
                    'key' => $notice->categories->main->key,
                ],
                'sub' => array_values(array_map(
                    static fn ($category) => ['id' => $category->id, 'key' => $category->key],
                    array_filter($notice->categories->sub, static fn ($category) => $category !== null),
                )),
            ],
        ];
    }
}
