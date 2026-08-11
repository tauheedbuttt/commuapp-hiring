<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations\Notice;

/**
 * @property string $__typename
 * @property \App\Services\Commu\Generated\Operations\Notice\Notice\Notice|null $notice
 */
class Notice extends \Spawnia\Sailor\ObjectLike
{
    /**
     * @param \App\Services\Commu\Generated\Operations\Notice\Notice\Notice|null $notice
     */
    public static function make(
        $notice = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
    ): self {
        $instance = new self;

        $instance->__typename = 'Query';
        if ($notice !== self::UNDEFINED) {
            $instance->__set('notice', $notice);
        }

        return $instance;
    }

    protected function converters(): array
    {
        /** @var array<string, \Spawnia\Sailor\Convert\TypeConverter>|null $converters */
        static $converters;

        return $converters ??= [
            '__typename' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'notice' => new \Spawnia\Sailor\Convert\NullConverter(new \App\Services\Commu\Generated\Operations\Notice\Notice\Notice),
        ];
    }

    public static function endpoint(): string
    {
        return 'commu';
    }

    public static function config(): string
    {
        return \Safe\realpath(__DIR__ . '/../../../../../../sailor.php');
    }
}
