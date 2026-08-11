<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data;

/**
 * @property string $id
 * @property string $title
 * @property string $type
 * @property mixed $created_at
 * @property \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Position\NoticePosition $position
 * @property \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Categories\NoticeCategories $categories
 * @property string $__typename
 * @property string|null $description
 * @property string|null $side
 * @property float|null $distance_to_user
 * @property \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Image\Asset|null $image
 * @property \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Owner\User|null $owner
 * @property \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Company\Company|null $company
 */
class Notice extends \Spawnia\Sailor\ObjectLike
{
    /**
     * @param string $id
     * @param string $title
     * @param string $type
     * @param mixed $created_at
     * @param \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Position\NoticePosition $position
     * @param \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Categories\NoticeCategories $categories
     * @param string|null $description
     * @param string|null $side
     * @param float|null $distance_to_user
     * @param \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Image\Asset|null $image
     * @param \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Owner\User|null $owner
     * @param \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Company\Company|null $company
     */
    public static function make(
        $id,
        $title,
        $type,
        $created_at,
        $position,
        $categories,
        $description = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $side = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $distance_to_user = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $image = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $owner = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
        $company = 'Special default value that allows Sailor to differentiate between explicitly passing null and not passing a value at all.',
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
        if ($side !== self::UNDEFINED) {
            $instance->__set('side', $side);
        }
        if ($distance_to_user !== self::UNDEFINED) {
            $instance->__set('distance_to_user', $distance_to_user);
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
            'position' => new \Spawnia\Sailor\Convert\NonNullConverter(new \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Position\NoticePosition),
            'categories' => new \Spawnia\Sailor\Convert\NonNullConverter(new \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Categories\NoticeCategories),
            '__typename' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'description' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\StringConverter),
            'side' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\EnumConverter),
            'distance_to_user' => new \Spawnia\Sailor\Convert\NullConverter(new \Spawnia\Sailor\Convert\FloatConverter),
            'image' => new \Spawnia\Sailor\Convert\NullConverter(new \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Image\Asset),
            'owner' => new \Spawnia\Sailor\Convert\NullConverter(new \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Owner\User),
            'company' => new \Spawnia\Sailor\Convert\NullConverter(new \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Company\Company),
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
