<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Categories\Sub;

/**
 * @property string $key
 * @property string $__typename
 * @property string|null $id
 */
class Category extends \Spawnia\Sailor\ObjectLike
{
    /**
     * @param string $key
     * @param string|null $id
     */
    public static function make(
        $key,
        $id = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
    ): self {
        $instance = new self;

        if ($key !== self::UNDEFINED) {
            $instance->__set('key', $key);
        }
        $instance->__typename = 'Category';
        if ($id !== self::UNDEFINED) {
            $instance->__set('id', $id);
        }

        return $instance;
    }

    protected function converters(): array
    {
        /** @var array<string, \Spawnia\Sailor\Convert\TypeConverter>|null $converters */
        static $converters;

        return $converters ??= [
            'key' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            '__typename' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'id' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\IDConverter),
        ];
    }

    public static function endpoint(): string
    {
        return 'commu';
    }

    public static function config(): string
    {
        return \Safe\realpath(__DIR__ . '/../../../../../../../../../../sailor.php');
    }
}
