<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Types;

class QueryNoticesWhereDistanceOrderByColumn
{
    public const CREATED_AT = 'CREATED_AT';

    public static function endpoint(): string
    {
        return 'commu';
    }

    public static function config(): string
    {
        return \Safe\realpath(__DIR__ . '/../../../../../sailor.php');
    }
}
