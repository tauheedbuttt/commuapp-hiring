<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * GraphQL error categories this backend throws, surfaced to clients as
 * `extensions.category`. Lighthouse's own `@rules` validation failures use
 * the `validation` category natively and are not part of this enum.
 */
enum ErrorCategory: string
{
    case NotFound = 'not_found';
    case Upstream = 'upstream';
}
