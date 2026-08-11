<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations\Notice\Notice\Owner;

/**
 * @property string $id
 * @property string $name
 * @property array<int, \App\Services\Commu\Generated\Operations\Notice\Notice\Owner\AccountVerifications\AccountVerification|null> $accountVerifications
 * @property string $__typename
 * @property string|null $avatar_url
 * @property int|null $trust_level
 */
class User extends \Spawnia\Sailor\ObjectLike
{
    /**
     * @param string $id
     * @param string $name
     * @param array<int, \App\Services\Commu\Generated\Operations\Notice\Notice\Owner\AccountVerifications\AccountVerification|null> $accountVerifications
     * @param string|null $avatar_url
     * @param int|null $trust_level
     */
    public static function make(
        $id,
        $name,
        $accountVerifications,
        $avatar_url = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $trust_level = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
    ): self {
        $instance = new self;

        if ($id !== self::UNDEFINED) {
            $instance->__set('id', $id);
        }
        if ($name !== self::UNDEFINED) {
            $instance->__set('name', $name);
        }
        if ($accountVerifications !== self::UNDEFINED) {
            $instance->__set('accountVerifications', $accountVerifications);
        }
        $instance->__typename = 'User';
        if ($avatar_url !== self::UNDEFINED) {
            $instance->__set('avatar_url', $avatar_url);
        }
        if ($trust_level !== self::UNDEFINED) {
            $instance->__set('trust_level', $trust_level);
        }

        return $instance;
    }

    protected function converters(): array
    {
        /** @var array<string, \Spawnia\Sailor\Convert\TypeConverter>|null $converters */
        static $converters;

        return $converters ??= [
            'id' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\IDConverter),
            'name' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'accountVerifications' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\ListConverter(new \Spawnia\Sailor\Convert\NullConverter(new \App\Services\Commu\Generated\Operations\Notice\Notice\Owner\AccountVerifications\AccountVerification))),
            '__typename' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'avatar_url' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'trust_level' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\IntConverter),
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
