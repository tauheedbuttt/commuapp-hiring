<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance;

/**
 * @property \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\PaginatorInfo\PaginatorInfo $paginatorInfo
 * @property array<int, \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Notice> $data
 * @property string $__typename
 */
class NoticePaginator extends \Spawnia\Sailor\ObjectLike
{
    /**
     * @param \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\PaginatorInfo\PaginatorInfo $paginatorInfo
     * @param array<int, \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Notice> $data
     */
    public static function make($paginatorInfo, $data): self
    {
        $instance = new self;

        if ($paginatorInfo !== self::UNDEFINED) {
            $instance->__set('paginatorInfo', $paginatorInfo);
        }
        if ($data !== self::UNDEFINED) {
            $instance->__set('data', $data);
        }
        $instance->__typename = 'NoticePaginator';

        return $instance;
    }

    protected function converters(): array
    {
        /** @var array<string, \Spawnia\Sailor\Convert\TypeConverter>|null $converters */
        static $converters;

        return $converters ??= [
            'paginatorInfo' => new \Spawnia\Sailor\Convert\NonNullConverter(new \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\PaginatorInfo\PaginatorInfo),
            'data' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\ListConverter(new \Spawnia\Sailor\Convert\NonNullConverter(new \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\Data\Notice))),
            '__typename' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
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
