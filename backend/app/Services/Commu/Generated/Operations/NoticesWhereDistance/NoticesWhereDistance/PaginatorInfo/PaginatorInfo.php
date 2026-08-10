<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\PaginatorInfo;

/**
 * @property int $count
 * @property int $currentPage
 * @property bool $hasMorePages
 * @property string $__typename
 */
class PaginatorInfo extends \Spawnia\Sailor\ObjectLike
{
    /**
     * @param int $count
     * @param int $currentPage
     * @param bool $hasMorePages
     */
    public static function make($count, $currentPage, $hasMorePages): self
    {
        $instance = new self;

        if ($count !== self::UNDEFINED) {
            $instance->__set('count', $count);
        }
        if ($currentPage !== self::UNDEFINED) {
            $instance->__set('currentPage', $currentPage);
        }
        if ($hasMorePages !== self::UNDEFINED) {
            $instance->__set('hasMorePages', $hasMorePages);
        }
        $instance->__typename = 'PaginatorInfo';

        return $instance;
    }

    protected function converters(): array
    {
        /** @var array<string, \Spawnia\Sailor\Convert\TypeConverter>|null $converters */
        static $converters;

        return $converters ??= [
            'count' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\IntConverter),
            'currentPage' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\IntConverter),
            'hasMorePages' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\BooleanConverter),
            '__typename' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
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
