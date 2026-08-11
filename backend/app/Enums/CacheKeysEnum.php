<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Cache keys this backend stores through `FailOpenCache`. Each case's key
 * format and TTL live in `FailOpenCache`'s registry, not at call sites.
 */
enum CacheKeysEnum: string
{
    case Geocode = 'geocode';
    case AreaSummary = 'area_summary';
    case AreaSummaryNoticeBatch = 'area_summary_notice_batch';
}
