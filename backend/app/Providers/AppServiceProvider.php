<?php

namespace App\Providers;

use Aws\BedrockRuntime\BedrockRuntimeClient;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(BedrockRuntimeClient::class, fn () => new BedrockRuntimeClient([
            'region' => config('services.bedrock.region'),
            'version' => 'latest',
        ]));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
