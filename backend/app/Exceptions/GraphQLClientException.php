<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Enums\ErrorCategory;
use GraphQL\Error\ClientAware;
use GraphQL\Error\ProvidesExtensions;

/**
 * Single reusable exception for backend-thrown GraphQL client errors.
 * Carries an {@see ErrorCategory} so new categories don't need new
 * exception subclasses.
 */
class GraphQLClientException extends \Exception implements ClientAware, ProvidesExtensions
{
    public function __construct(
        string $message,
        private readonly ErrorCategory $category,
    ) {
        parent::__construct($message);
    }

    public function getCategory(): ErrorCategory
    {
        return $this->category;
    }

    public function isClientSafe(): bool
    {
        return true;
    }

    /** @return array{category: string} */
    public function getExtensions(): array
    {
        return [
            'category' => $this->category->value,
        ];
    }
}
