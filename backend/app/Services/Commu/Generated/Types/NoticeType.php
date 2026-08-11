<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Types;

class NoticeType
{
    public const GIVE_SELL = 'GIVE_SELL';
    public const GIVE_TRADE = 'GIVE_TRADE';
    public const GIVE_FREE = 'GIVE_FREE';
    public const GIVE_GENERIC = 'GIVE_GENERIC';
    public const NEED_BUY = 'NEED_BUY';
    public const NEED_TRADE = 'NEED_TRADE';
    public const NEED_FREE = 'NEED_FREE';
    public const NEED_GENERIC = 'NEED_GENERIC';
    public const COLLECTOR = 'COLLECTOR';

    public static function endpoint(): string
    {
        return 'commu';
    }

    public static function config(): string
    {
        return \Safe\realpath(__DIR__ . '/../../../../../sailor.php');
    }
}
