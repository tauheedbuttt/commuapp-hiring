<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // GraphQL distinguishes "" from null in input values (e.g. an empty
        // town string should hit our own @rules validation, not silently
        // become a null variable). Laravel's default string-normalizing
        // middleware would collapse that distinction, so skip it for /graphql.
        $isGraphQLRequest = fn (Request $request): bool => $request->is('graphql');

        $middleware->convertEmptyStringsToNull(except: [$isGraphQLRequest]);
        $middleware->trimStrings(except: [$isGraphQLRequest]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })->create();
