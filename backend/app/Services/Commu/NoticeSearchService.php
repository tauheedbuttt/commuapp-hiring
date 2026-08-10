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
use Illuminate\Support\Facades\Log;
use Spawnia\Sailor\Error\ResultErrorsException;

/**
 * Fetches nearby help posts from the upstream Commu API via the
 * schema-generated Sailor client. No GraphQL knowledge of our own
 * schema — returns plain arrays trimmed to the fields this app needs.
 */
class NoticeSearchService
{
    /** @return array{paginatorInfo: array{count: int, currentPage: int, hasMorePages: bool}, data: list<array<string, mixed>>} */
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
        } catch (\Throwable $e) {
            Log::error('Commu noticesWhereDistance request failed.', ['exception' => $e]);

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

        if ($data === null) {
            throw new GraphQLClientException(
                'The Commu service returned an empty response.',
                ErrorCategory::Upstream,
            );
        }

        $paginator = $data->noticesWhereDistance;

        return [
            'paginatorInfo' => [
                'count' => $paginator->paginatorInfo->count,
                'currentPage' => $paginator->paginatorInfo->currentPage,
                'hasMorePages' => $paginator->paginatorInfo->hasMorePages,
            ],
            'data' => array_map($this->mapNotice(...), $paginator->data),
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
            'created_at' => $notice->created_at,
            'distance_to_user' => $notice->distance_to_user,
            'position' => [
                'latitude' => $notice->position->latitude,
                'longitude' => $notice->position->longitude,
            ],
            'categories' => [
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
