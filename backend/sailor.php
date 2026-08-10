<?php

declare(strict_types=1);

use Spawnia\Sailor;

require_once __DIR__.'/vendor/autoload.php';

// Reads $_ENV directly rather than config('services.commu.*'): this file also
// runs standalone via `vendor/bin/sailor` for codegen, before Laravel boots.
Dotenv\Dotenv::createImmutable(__DIR__)->safeLoad();

return [
    'commu' => new class extends Sailor\EndpointConfig
    {
        public function makeClient(): Sailor\Client
        {
            $graphqlUrl = getenv('COMMU_GRAPHQL_URL') ?: null;
            $bearerToken = getenv('COMMU_BEARER_TOKEN') ?: null;

            if ($graphqlUrl === null || $bearerToken === null) {
                throw new RuntimeException('COMMU_GRAPHQL_URL and COMMU_BEARER_TOKEN must both be set.');
            }

            return new Sailor\Client\Guzzle(
                $graphqlUrl,
                [
                    'headers' => [
                        'Authorization' => 'Bearer '.$bearerToken,
                    ],
                ]
            );
        }

        public function namespace(): string
        {
            return 'App\\Services\\Commu\\Generated';
        }

        public function targetPath(): string
        {
            return __DIR__.'/app/Services/Commu/Generated';
        }

        public function schemaPath(): string
        {
            return __DIR__.'/app/Services/Commu/Sailor/schema.graphql';
        }

        public function finder(): Sailor\Codegen\Finder
        {
            return new Sailor\Codegen\DirectoryFinder(__DIR__.'/app/Services/Commu/Sailor/operations');
        }
    },
];
