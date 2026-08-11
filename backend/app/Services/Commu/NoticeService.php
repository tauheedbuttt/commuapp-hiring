<?php

declare(strict_types=1);

namespace App\Services\Commu;

use App\Enums\ErrorCategory;
use App\Exceptions\GraphQLClientException;
use App\Services\Commu\Generated\Operations\Notice as NoticeOperation;
use App\Services\Commu\Generated\Operations\NoticesWhereDistance as NoticesWhereDistanceOperation;
use App\Services\Commu\Generated\Types\LocationUserPoint;
use App\Services\Commu\Generated\Types\QueryNoticesWhereDistanceOrderByColumn;
use App\Services\Commu\Generated\Types\QueryNoticesWhereDistanceOrderByOrderByClause;
use App\Services\Commu\Generated\Types\SortOrder;
use Illuminate\Support\Facades\Log;
use Spawnia\Sailor\Error\ResultErrorsException;

/**
 * All calls to the upstream Commu API's notice* queries, via the
 * schema-generated Sailor client. Returns plain arrays trimmed to the
 * fields this app needs — field mapping itself lives in NoticeFieldMapper.
 */
class NoticeService
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

        $paginator = $data->noticesWhereDistance;

        return [
            'paginatorInfo' => [
                'count' => $paginator->paginatorInfo->count,
                'currentPage' => $paginator->paginatorInfo->currentPage,
                'hasMorePages' => $paginator->paginatorInfo->hasMorePages,
            ],
            'data' => array_map(NoticeFieldMapper::searchListItem(...), $paginator->data),
        ];
    }

    /** @return array<string, mixed> */
    public function find(string $id, ?float $latitude, ?float $longitude): array
    {
        try {
            $result = $latitude !== null && $longitude !== null
                ? NoticeOperation::execute(
                    id: $id,
                    distanceToPoint: LocationUserPoint::make(latitude: $latitude, longitude: $longitude),
                )
                : NoticeOperation::execute(id: $id);
        } catch (\Throwable $e) {
            Log::error('Commu notice request failed.', ['exception' => $e]);

            throw new GraphQLClientException(
                'Could not reach the Commu service.',
                ErrorCategory::Upstream,
            );
        }

        $notice = $result->data?->notice;

        if ($notice === null) {
            if ($result->data === null || self::hasAuthError($result->errors)) {
                Log::error('Commu notice request returned an error.', ['errors' => $result->errors]);

                throw new GraphQLClientException(
                    'The Commu service returned an error.',
                    ErrorCategory::Upstream,
                );
            }

            throw new GraphQLClientException(
                'Help post not found.',
                ErrorCategory::NotFound,
            );
        }

        if ($result->errors !== null) {
            Log::warning('Commu notice request returned partial errors alongside a result.', [
                'id' => $id,
                'errors' => $result->errors,
            ]);
        }

        return NoticeFieldMapper::detail($notice);
    }

    /** @param  array<int, \Spawnia\Sailor\Error\Error>|null  $errors */
    private static function hasAuthError(?array $errors): bool
    {
        foreach ($errors ?? [] as $error) {
            if ($error->message === 'Unauthenticated.') {
                return true;
            }
        }

        return false;
    }
}
