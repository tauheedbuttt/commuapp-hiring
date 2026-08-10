<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Position;

/**
 * @property float $latitude
 * @property float $longitude
 * @property string $__typename
 */
class NoticePosition extends \Spawnia\Sailor\ObjectLike
{
    /**
     * @param float $latitude
     * @param float $longitude
     */
    public static function make($latitude, $longitude): self
    {
        $instance = new self;

        if ($latitude !== self::UNDEFINED) {
            $instance->__set('latitude', $latitude);
        }
        if ($longitude !== self::UNDEFINED) {
            $instance->__set('longitude', $longitude);
        }
        $instance->__typename = 'NoticePosition';

        return $instance;
    }

    protected function converters(): array
    {
        /** @var array<string, \Spawnia\Sailor\Convert\TypeConverter>|null $converters */
        static $converters;

        return $converters ??= [
            'latitude' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\FloatConverter),
            'longitude' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\FloatConverter),
            '__typename' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
        ];
    }

    public static function endpoint(): string
    {
        return 'commu';
    }

    public static function config(): string
    {
        return \Safe\realpath(__DIR__ . '/../../../../../../../../../sailor.php');
    }
}
