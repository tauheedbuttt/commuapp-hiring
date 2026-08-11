<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations\Notice\Notice\Notice_language_versions;

/**
 * @property string $title
 * @property string $language
 * @property string $__typename
 * @property string|null $description
 * @property string|null $in_return
 */
class NoticeTranslation extends \Spawnia\Sailor\ObjectLike
{
    /**
     * @param string $title
     * @param string $language
     * @param string|null $description
     * @param string|null $in_return
     */
    public static function make(
        $title,
        $language,
        $description = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $in_return = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
    ): self {
        $instance = new self;

        if ($title !== self::UNDEFINED) {
            $instance->__set('title', $title);
        }
        if ($language !== self::UNDEFINED) {
            $instance->__set('language', $language);
        }
        $instance->__typename = 'NoticeTranslation';
        if ($description !== self::UNDEFINED) {
            $instance->__set('description', $description);
        }
        if ($in_return !== self::UNDEFINED) {
            $instance->__set('in_return', $in_return);
        }

        return $instance;
    }

    protected function converters(): array
    {
        /** @var array<string, \Spawnia\Sailor\Convert\TypeConverter>|null $converters */
        static $converters;

        return $converters ??= [
            'title' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'language' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            '__typename' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'description' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'in_return' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\StringConverter),
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
