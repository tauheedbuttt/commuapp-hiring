<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations\NoticesWhereDistance;

/**
 * @property \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\NoticePaginator $noticesWhereDistance
 * @property string $__typename
 */
class NoticesWhereDistance extends \Spawnia\Sailor\ObjectLike
{
    /**
     * @param \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\NoticePaginator $noticesWhereDistance
     */
    public static function make($noticesWhereDistance): self
    {
        $instance = new self;

        if ($noticesWhereDistance !== self::UNDEFINED) {
            $instance->__set('noticesWhereDistance', $noticesWhereDistance);
        }
        $instance->__typename = 'Query';

        return $instance;
    }

    protected function converters(): array
    {
        /** @var array<string, \Spawnia\Sailor\Convert\TypeConverter>|null $converters */
        static $converters;

        return $converters ??= [
            'noticesWhereDistance' => new \Spawnia\Sailor\Convert\NonNullConverter(new \App\Services\Commu\Generated\Operations\NoticesWhereDistance\NoticesWhereDistance\NoticePaginator),
            '__typename' => new \Spawnia\Sailor\Convert\NonNullConverter(new \Spawnia\Sailor\Convert\StringConverter),
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
