<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations;

/**
 * @extends \Spawnia\Sailor\Operation<\App\Services\Commu\Generated\Operations\Notice\NoticeResult>
 */
class Notice extends \Spawnia\Sailor\Operation
{
    /**
     * @param int|string $id
     * @param \App\Services\Commu\Generated\Types\LocationUserPoint|null $distanceToPoint
     */
    public static function execute(
        $id,
        $distanceToPoint = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
    ): Notice\NoticeResult {
        return self::executeOperation(
            $id,
            $distanceToPoint,
        );
    }

    protected static function converters(): array
    {
        /** @var array<int, array{string, \Spawnia\Sailor\Convert\TypeConverter}>|null $converters */
        static $converters;

        return $converters ??= [
            ['id', new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\IDConverter)],
            ['distanceToPoint', new \Spawnia\Sailor\Convert\NullConverter(new \App\Services\Commu\Generated\Types\LocationUserPoint)],
        ];
    }

    public static function document(): string
    {
        return /* @lang GraphQL */ 'query Notice($id: ID!, $distanceToPoint: LocationUserPoint) {
          __typename
          notice(id: $id, distanceToPoint: $distanceToPoint) {
            __typename
            id
            title
            description
            in_return
            type
            side
            created_at
            expires_at
            distance_to_user
            likes
            image {
              __typename
              url
            }
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
            owner {
              __typename
              id
              name
              avatar_url
              trust_level
              accountVerifications {
                __typename
                type
                completed_at
              }
            }
            company {
              __typename
              id
              name
              logo_url
            }
            notice_language_versions {
              __typename
              title
              description
              in_return
              language
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
