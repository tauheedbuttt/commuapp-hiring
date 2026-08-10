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
            return new Sailor\Client\Guzzle(
                $_ENV['COMMU_GRAPHQL_URL'],
                [
                    'headers' => [
                        'Authorization' => 'Bearer '.$_ENV['COMMU_BEARER_TOKEN'],
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
