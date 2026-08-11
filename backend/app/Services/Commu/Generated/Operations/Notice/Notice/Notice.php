<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations\Notice\Notice;

/**
 * @property string $id
 * @property string $title
 * @property string $type
 * @property mixed $created_at
 * @property \App\Services\Commu\Generated\Operations\Notice\Notice\Position\NoticePosition $position
 * @property \App\Services\Commu\Generated\Operations\Notice\Notice\Categories\NoticeCategories $categories
 * @property string $__typename
 * @property string|null $description
 * @property string|null $in_return
 * @property string|null $side
 * @property float|null $distance_to_user
 * @property int|null $likes
 * @property \App\Services\Commu\Generated\Operations\Notice\Notice\Image\Asset|null $image
 * @property \App\Services\Commu\Generated\Operations\Notice\Notice\Owner\User|null $owner
 * @property \App\Services\Commu\Generated\Operations\Notice\Notice\Company\Company|null $company
 * @property array<int, \App\Services\Commu\Generated\Operations\Notice\Notice\Notice_language_versions\NoticeTranslation|null>|null $notice_language_versions
 */
class Notice extends \Spawnia\Sailor\ObjectLike
{
    /**
     * @param string $id
     * @param string $title
     * @param string $type
     * @param mixed $created_at
     * @param \App\Services\Commu\Generated\Operations\Notice\Notice\Position\NoticePosition $position
     * @param \App\Services\Commu\Generated\Operations\Notice\Notice\Categories\NoticeCategories $categories
     * @param string|null $description
     * @param string|null $in_return
     * @param string|null $side
     * @param float|null $distance_to_user
     * @param int|null $likes
     * @param \App\Services\Commu\Generated\Operations\Notice\Notice\Image\Asset|null $image
     * @param \App\Services\Commu\Generated\Operations\Notice\Notice\Owner\User|null $owner
     * @param \App\Services\Commu\Generated\Operations\Notice\Notice\Company\Company|null $company
     * @param array<int, \App\Services\Commu\Generated\Operations\Notice\Notice\Notice_language_versions\NoticeTranslation|null>|null $notice_language_versions
     */
    public static function make(
        $id,
        $title,
        $type,
        $created_at,
        $position,
        $categories,
        $description = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $in_return = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $side = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $distance_to_user = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $likes = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $image = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $owner = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $company = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $notice_language_versions = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
    ): self {
        $instance = new self;

        if ($id !== self::UNDEFINED) {
            $instance->__set('id', $id);
        }
        if ($title !== self::UNDEFINED) {
            $instance->__set('title', $title);
        }
        if ($type !== self::UNDEFINED) {
            $instance->__set('type', $type);
        }
        if ($created_at !== self::UNDEFINED) {
            $instance->__set('created_at', $created_at);
        }
        if ($position !== self::UNDEFINED) {
            $instance->__set('position', $position);
        }
        if ($categories !== self::UNDEFINED) {
            $instance->__set('categories', $categories);
        }
        $instance->__typename = 'Notice';
        if ($description !== self::UNDEFINED) {
            $instance->__set('description', $description);
        }
        if ($in_return !== self::UNDEFINED) {
            $instance->__set('in_return', $in_return);
        }
        if ($side !== self::UNDEFINED) {
            $instance->__set('side', $side);
        }
        if ($distance_to_user !== self::UNDEFINED) {
            $instance->__set('distance_to_user', $distance_to_user);
        }
        if ($likes !== self::UNDEFINED) {
            $instance->__set('likes', $likes);
        }
        if ($image !== self::UNDEFINED) {
            $instance->__set('image', $image);
        }
        if ($owner !== self::UNDEFINED) {
            $instance->__set('owner', $owner);
        }
        if ($company !== self::UNDEFINED) {
            $instance->__set('company', $company);
        }
        if ($notice_language_versions !== self::UNDEFINED) {
            $instance->__set('notice_language_versions', $notice_language_versions);
        }

        return $instance;
    }

    protected function converters(): array
    {
        /** @var array<string, \Spawnia\Sailor\Convert\TypeConverter>|null $converters */
        static $converters;

        return $converters ??= [
            'id' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\IDConverter),
            'title' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'type' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\EnumConverter),
            'created_at' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\ScalarConverter),
            'position' => new \Spawnia\Sailor\Convert\NonNullConverter(new \App\Services\Commu\Generated\Operations\Notice\Notice\Position\NoticePosition),
            'categories' => new \Spawnia\Sailor\Convert\NonNullConverter(new \App\Services\Commu\Generated\Operations\Notice\Notice\Categories\NoticeCategories),
            '__typename' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'description' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'in_return' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'side' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\EnumConverter),
            'distance_to_user' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\FloatConverter),
            'likes' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\IntConverter),
            'image' => new \Spawnia\Sailor\Convert\NullConverter(new \App\Services\Commu\Generated\Operations\Notice\Notice\Image\Asset),
            'owner' => new \Spawnia\Sailor\Convert\NullConverter(new \App\Services\Commu\Generated\Operations\Notice\Notice\Owner\User),
            'company' => new \Spawnia\Sailor\Convert\NullConverter(new \App\Services\Commu\Generated\Operations\Notice\Notice\Company\Company),
            'notice_language_versions' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\ListConverter(new \Spawnia\Sailor\Convert\NullConverter(new \App\Services\Commu\Generated\Operations\Notice\Notice\Notice_language_versions\NoticeTranslation))),
        ];
    }

    public static function endpoint(): string
    {
        return 'commu';
    }

    public static function config(): string
    {
        return \Safe\realpath(__DIR__ . '/../../../../../../../sailor.php');
    }
}
