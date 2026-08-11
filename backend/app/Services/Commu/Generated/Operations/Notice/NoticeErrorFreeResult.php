<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations\Notice;

class NoticeErrorFreeResult extends \Spawnia\Sailor\ErrorFreeResult
{
    public Notice $data;

    public static function endpoint(): string
    {
        return 'commu';
    }

    public static function config(): string
    {
        return \Safe\realpath(__DIR__ . '/../../../../../../sailor.php');
    }
}
