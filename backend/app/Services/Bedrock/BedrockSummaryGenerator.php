<?php

declare(strict_types=1);

namespace App\Services\Bedrock;

use App\Enums\ErrorCategory;
use App\Exceptions\GraphQLClientException;
use Aws\BedrockRuntime\BedrockRuntimeClient;
use Illuminate\Support\Facades\Log;

/**
 * Generates a short prose summary of nearby help posts via AWS Bedrock's
 * Converse API (Amazon Nova Lite). No GraphQL or caching knowledge — takes
 * an already-trimmed notice batch and returns plain text.
 */
class BedrockSummaryGenerator
{
    public function __construct(
        private readonly BedrockRuntimeClient $client,
    ) {}

    /** @param  list<array<string, mixed>>  $notices */
    public function generate(string $town, array $notices): string
    {
        try {
            $result = $this->client->converse([
                'modelId' => config('services.bedrock.model_id'),
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => [
                            ['text' => $this->buildPrompt($town, $notices)],
                        ],
                    ],
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Bedrock converse request failed.', ['exception' => $e]);

            throw new GraphQLClientException(
                'Could not generate the area summary.',
                ErrorCategory::Upstream,
            );
        }

        return self::extractText($result);
    }

    /**
     * Pulls the plain-text reply out of a raw Bedrock `converse()` response.
     * Shared with `app:test-bedrock`, which calls the SDK directly and needs
     * the same extraction without pulling in this class's caching/prompt
     * concerns.
     *
     * @param  array<string, mixed>  $result
     */
    public static function extractText(array $result): string
    {
        return collect($result['output']['message']['content'])
            ->pluck('text')
            ->implode('');
    }

    /** @param  list<array<string, mixed>>  $notices */
    private function buildPrompt(string $town, array $notices): string
    {
        $notices = json_encode($notices, JSON_PRETTY_PRINT);

        return <<<PROMPT
            You are summarizing recent help posts near {$town} for a community app.
            Each post is either a request for help ("NEED") or an offer of help ("GIVE"), with a title, description, type, side, and category.

            Posts (JSON):
            {$notices}

            Write a 2-4 sentence plain-prose summary of the kinds of help typically requested or offered in this area, based only on these posts. Mention "{$town}" by name. Do not use bullet points or markdown. Return only the summary text.
            PROMPT;
    }
}
