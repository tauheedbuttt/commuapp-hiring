<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations;

/**
 * @extends \Spawnia\Sailor\Operation<\App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistanceResult>
 */
class NoticesWhereDistance extends \Spawnia\Sailor\Operation
{
    /**
     * @param float|int $lat
     * @param float|int $long
     * @param int $distance
     * @param int $first
     * @param int|null $page
     * @param array<\App\Services\Commu\Generated\Types\QueryNoticesWhereDistanceOrderByOrderByClause>|null $orderBy
     */
    public static function execute(
        $lat,
        $long,
        $distance,
        $first,
        $page = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $orderBy = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
    ): NoticesWhereDistance\NoticesWhereDistanceResult {
        return self::executeOperation(
            $lat,
            $long,
            $distance,
            $first,
            $page,
            $orderBy,
        );
    }

    protected static function converters(): array
    {
        /** @var array<int, array{string, \Spawnia\Sailor\Convert\TypeConverter}>|null $converters */
        static $converters;

        return $converters ??= [
            ['lat', new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\FloatConverter)],
            ['long', new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\FloatConverter)],
            ['distance', new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\IntConverter)],
            ['first', new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\IntConverter)],
            ['page', new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\IntConverter)],
            ['orderBy', new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\ListConverter(new \Spawnia\Sailor\Convert\NonNullConverter(new \App\Services\Commu\Generated\Types\QueryNoticesWhereDistanceOrderByOrderByClause)))],
        ];
    }

    public static function document(): string
    {
        return /* @lang GraphQL */ 'query NoticesWhereDistance($lat: Float!, $long: Float!, $distance: Int!, $first: Int!, $page: Int, $orderBy: [QueryNoticesWhereDistanceOrderByOrderByClause!]) {
          __typename
          noticesWhereDistance(
            lat: $lat
            long: $long
            distance: $distance
            first: $first
            page: $page
            orderBy: $orderBy
          ) {
            __typename
            paginatorInfo {
              __typename
              count
              currentPage
              hasMorePages
            }
            data {
              __typename
              id
              title
              description
              type
              side
              created_at
              distance_to_user
              position {
                __typename
                latitude
                longitude
              }
              categories {
                __typename
                main {
                  __typename
                  id
                  key
                }
                sub {
                  __typename
                  id
                  key
                }
              }
              image {
                __typename
                url
              }
              owner {
                __typename
                id
                name
                avatar_url
              }
            }
          }
        }';
    }

    public static function endpoint(): string
    {
        return 'commu';
    }

    public static function config(): string
    {
        return \Safe\realpath(__DIR__ . '/../../../../../sailor.php');
    }
}
