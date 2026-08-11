<?php

declare(strict_types=1);

namespace App\Services\Summary;

use App\Enums\CacheKeysEnum;
use App\Services\Bedrock\BedrockSummaryGenerator;
use App\Services\Cache\FailOpenCache;
use App\Services\Commu\NoticeSearchService;

/**
 * Orchestrates the area-summary flow: cached summary → cached notice batch
 * → live Commu fetch → Bedrock generation, in that order, short-circuiting
 * as soon as a cache hit or a "not enough data" verdict is reached.
 */
class AreaSummaryService
{
    public function __construct(
        private readonly FailOpenCache $cache,
        private readonly NoticeSearchService $noticeSearch,
        private readonly BedrockSummaryGenerator $generator,
    ) {}

    /** @return array{summary: string} */
    public function generate(string $town, float $latitude, float $longitude, int $distanceMeters): array
    {
        $cachedSummary = $this->cache->get(CacheKeysEnum::AreaSummary, $town, $distanceMeters);

        if ($cachedSummary !== null) {
            return ['summary' => $cachedSummary];
        }

        $notices = $this->noticeBatch($town, $latitude, $longitude, $distanceMeters);

        $summary = count($notices) < (int) config('services.summary.min_notices')
            ? "Not enough nearby help posts to summarize activity in {$town} yet."
            : $this->generator->generate($town, array_map($this->trimNotice(...), $notices));

        $this->cache->remember(CacheKeysEnum::AreaSummary, $summary, $town, $distanceMeters);

        return ['summary' => $summary];
    }

    /** @return list<array<string, mixed>> */
    private function noticeBatch(string $town, float $latitude, float $longitude, int $distanceMeters): array
    {
        $cached = $this->cache->get(CacheKeysEnum::AreaSummaryNoticeBatch, $town, $distanceMeters);

        if ($cached !== null) {
            return $cached;
        }

        $notices = $this->noticeSearch->searchNearby(
            latitude: $latitude,
            longitude: $longitude,
            distanceMeters: $distanceMeters,
            first: (int) config('services.summary.notice_batch_count'),
            page: 1,
        )['data'];

        $this->cache->remember(CacheKeysEnum::AreaSummaryNoticeBatch, $notices, $town, $distanceMeters);

        return $notices;
    }

    /**
     * @param  array<string, mixed>  $notice
     * @return array<string, mixed>
     */
    private function trimNotice(array $notice): array
    {
        return [
            'title' => $notice['title'],
            'description' => $notice['description'],
            'type' => $notice['type'],
            'side' => $notice['side'],
            'categories' => [
                'main' => $notice['categories']['main']['key'] ?? null,
                'sub' => array_column($notice['categories']['sub'], 'key'),
            ],
        ];
    }
}
