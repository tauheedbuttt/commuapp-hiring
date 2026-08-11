<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations\Notice\Notice\Categories;

/**
 * @property array<int, \App\Services\Commu\Generated\Operations\Notice\Notice\Categories\Sub\Category|null> $sub
 * @property string $__typename
 * @property \App\Services\Commu\Generated\Operations\Notice\Notice\Categories\Main\Category|null $main
 */
class NoticeCategories extends \Spawnia\Sailor\ObjectLike
{
    /**
     * @param array<int, \App\Services\Commu\Generated\Operations\Notice\Notice\Categories\Sub\Category|null> $sub
     * @param \App\Services\Commu\Generated\Operations\Notice\Notice\Categories\Main\Category|null $main
     */
    public static function make(
        $sub,
        $main = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
    ): self {
        $instance = new self;

        if ($sub !== self::UNDEFINED) {
            $instance->__set('sub', $sub);
        }
        $instance->__typename = 'NoticeCategories';
        if ($main !== self::UNDEFINED) {
            $instance->__set('main', $main);
        }

        return $instance;
    }

    protected function converters(): array
    {
        /** @var array<string, \Spawnia\Sailor\Convert\TypeConverter>|null $converters */
        static $converters;

        return $converters ??= [
            'sub' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\ListConverter(new \Spawnia\Sailor\Convert\NullConverter(new \App\Services\Commu\Generated\Operations\Notice\Notice\Categories\Sub\Category))),
            '__typename' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'main' => new \Spawnia\Sailor\Convert\NullConverter(new \App\Services\Commu\Generated\Operations\Notice\Notice\Categories\Main\Category),
        ];
    }

    public static function endpoint(): string
    {
        return 'commu';
    }

    public static function config(): string
    {
        return \Safe\realpath(__DIR__ . '/../../../../../../../../sailor.php');
    }
}
