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

            Write a concise 2-sentence plain-prose summary of the kinds of help typically requested or offered in this area, based only on these posts. Mention "{$town}" by name. No filler, no bullet points, no markdown. Return only the summary text.
            PROMPT;
    }
}
