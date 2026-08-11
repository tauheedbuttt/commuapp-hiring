<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\Bedrock\BedrockSummaryGenerator;
use Aws\BedrockRuntime\BedrockRuntimeClient;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:test-bedrock')]
#[Description('Call AWS Bedrock Converse API directly, as a manual smoke check of the call shape (mirrors testing/test.php).')]
class TestBedrock extends Command
{
    public function __construct(
        private readonly BedrockRuntimeClient $client,
    ) {
        parent::__construct();
    }

    public function handle(): void
    {
        $result = $this->client->converse([
            'modelId' => config('services.bedrock.model_id'),
            'messages' => [
                [
                    'role' => 'user',
                    'content' => [
                        ['text' => 'Write a one-sentence bedtime story about a unicorn.'],
                    ],
                ],
            ],
        ]);

        $this->line(BedrockSummaryGenerator::extractText($result));
    }
}
