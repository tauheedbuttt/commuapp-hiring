<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Types;

class FrontPageTemplates
{
    public const DEFAULT = 'DEFAULT';
    public const ORG_CONTENT_1 = 'ORG_CONTENT_1';
    public const ORG_CONTENT_PREFER_INTERNAL = 'ORG_CONTENT_PREFER_INTERNAL';

    public static function endpoint(): string
    {
        return 'commu';
    }

    public static function config(): string
    {
        return \Safe\realpath(__DIR__ . '/../../../../../sailor.php');
    }
}
