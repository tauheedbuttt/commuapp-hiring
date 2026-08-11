<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Types;

/**
 * @property float|int $latitude
 * @property float|int $longitude
 */
class LocationUserPoint extends \Spawnia\Sailor\ObjectLike
{
    /**
     * @param float|int $latitude
     * @param float|int $longitude
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

        return $instance;
    }

    protected function converters(): array
    {
        /** @var array<string, \Spawnia\Sailor\Convert\TypeConverter>|null $converters */
        static $converters;

        return $converters ??= [
            'latitude' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\FloatConverter),
            'longitude' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\FloatConverter),
        ];
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
