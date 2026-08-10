<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations\NoticesWhereDistance;

class NoticesWhereDistanceErrorFreeResult extends \Spawnia\Sailor\ErrorFreeResult
{
    public NoticesWhereDistance $data;

    public static function endpoint(): string
    {
        return 'commu';
    }

    public static function config(): string
    {
        return \Safe\realpath(__DIR__ . '/../../../../../../sailor.php');
    }
}
