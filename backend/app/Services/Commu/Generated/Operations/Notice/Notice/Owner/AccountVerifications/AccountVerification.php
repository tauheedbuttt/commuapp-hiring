<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations\Notice\Notice\Owner\AccountVerifications;

/**
 * @property string $type
 * @property string $__typename
 * @property mixed|null $completed_at
 */
class AccountVerification extends \Spawnia\Sailor\ObjectLike
{
    /**
     * @param string $type
     * @param mixed|null $completed_at
     */
    public static function make(
        $type,
        $completed_at = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
    ): self {
        $instance = new self;

        if ($type !== self::UNDEFINED) {
            $instance->__set('type', $type);
        }
        $instance->__typename = 'AccountVerification';
        if ($completed_at !== self::UNDEFINED) {
            $instance->__set('completed_at', $completed_at);
        }

        return $instance;
    }

    protected function converters(): array
    {
        /** @var array<string, \Spawnia\Sailor\Convert\TypeConverter>|null $converters */
        static $converters;

        return $converters ??= [
            'type' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            '__typename' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'completed_at' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\ScalarConverter),
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
