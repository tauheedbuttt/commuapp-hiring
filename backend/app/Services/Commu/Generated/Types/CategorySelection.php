<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Types;

/**
 * @property string $category
 * @property array<string|null>|null $subCategories
 * @property int|null $schema_version
 */
class CategorySelection extends \Spawnia\Sailor\ObjectLike
{
    /**
     * @param string $category
     * @param array<string|null>|null $subCategories
     * @param int|null $schema_version
     */
    public static function make(
        $category,
        $subCategories = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $schema_version = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
    ): self {
        $instance = new self;

        if ($category !== self::UNDEFINED) {
            $instance->__set('category', $category);
        }
        if ($subCategories !== self::UNDEFINED) {
            $instance->__set('subCategories', $subCategories);
        }
        if ($schema_version !== self::UNDEFINED) {
            $instance->__set('schema_version', $schema_version);
        }

        return $instance;
    }

    protected function converters(): array
    {
        /** @var array<string, \Spawnia\Sailor\Convert\TypeConverter>|null $converters */
        static $converters;

        return $converters ??= [
            'category' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'subCategories' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\ListConverter(new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\StringConverter))),
            'schema_version' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\IntConverter),
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
