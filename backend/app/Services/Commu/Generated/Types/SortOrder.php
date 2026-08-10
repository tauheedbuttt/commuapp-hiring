<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Types;

class SortOrder
{
    public const ASC = 'ASC';
    public const DESC = 'DESC';

    public static function endpoint(): string
    {
        return 'commu';
    }

    public static function config(): string
    {
        return \Safe\realpath(__DIR__ . '/../../../../../sailor.php');
    }
}
