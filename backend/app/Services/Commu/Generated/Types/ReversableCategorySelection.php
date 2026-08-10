<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Types;

/**
 * @property array<\App\Services\Commu\Generated\Types\CategorySelection|null>|null $include
 * @property array<\App\Services\Commu\Generated\Types\CategorySelection|null>|null $exclude
 */
class ReversableCategorySelection extends \Spawnia\Sailor\ObjectLike
{
    /**
     * @param array<\App\Services\Commu\Generated\Types\CategorySelection|null>|null $include
     * @param array<\App\Services\Commu\Generated\Types\CategorySelection|null>|null $exclude
     */
    public static function make(
        $include = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $exclude = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
    ): self {
        $instance = new self;

        if ($include !== self::UNDEFINED) {
            $instance->__set('include', $include);
        }
        if ($exclude !== self::UNDEFINED) {
            $instance->__set('exclude', $exclude);
        }

        return $instance;
    }

    protected function converters(): array
    {
        /** @var array<string, \Spawnia\Sailor\Convert\TypeConverter>|null $converters */
        static $converters;

        return $converters ??= [
            'include' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\ListConverter(new \Spawnia\Sailor\Convert\NullConverter(new \App\Services\Commu\Generated\Types\CategorySelection))),
            'exclude' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\ListConverter(new \Spawnia\Sailor\Convert\NullConverter(new \App\Services\Commu\Generated\Types\CategorySelection))),
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
