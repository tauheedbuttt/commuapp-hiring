<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Types;

/**
 * @property string $column
 * @property string $order
 */
class QueryNoticesWhereDistanceOrderByOrderByClause extends \Spawnia\Sailor\ObjectLike
{
    /**
     * @param string $column
     * @param string $order
     */
    public static function make($column, $order): self
    {
        $instance = new self;

        if ($column !== self::UNDEFINED) {
            $instance->__set('column', $column);
        }
        if ($order !== self::UNDEFINED) {
            $instance->__set('order', $order);
        }

        return $instance;
    }

    protected function converters(): array
    {
        /** @var array<string, \Spawnia\Sailor\Convert\TypeConverter>|null $converters */
        static $converters;

        return $converters ??= [
            'column' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\EnumConverter),
            'order' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\EnumConverter),
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
