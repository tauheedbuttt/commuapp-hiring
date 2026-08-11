<?php

declare(strict_types=1);

namespace App\Services\Commu;

use App\Enums\ErrorCategory;
use App\Exceptions\GraphQLClientException;
use App\Services\Commu\Generated\Operations\Notice as NoticeOperation;
use App\Services\Commu\Generated\Operations\Notice\Notice\Notice;
use App\Services\Commu\Generated\Types\LocationUserPoint;
use Illuminate\Support\Facades\Log;

/**
 * Fetches a single help post by id from the upstream Commu API via the
 * schema-generated Sailor client. Returns only the fields the help-post
 * detail screen needs, trimmed down from the full upstream Notice type.
 */
class NoticeDetailService
{
    /** @return array<string, mixed> */
    public function find(string $id, ?float $latitude, ?float $longitude): array
    {
        try {
            // Upstream 500s if distanceToPoint is sent as an explicit `null` variable, so
            // the argument must be omitted entirely (not passed) rather than passed as null.
            $result = $latitude !== null && $longitude !== null
                ? NoticeOperation::execute(
                    id: $id,
                    distanceToPoint: LocationUserPoint::make(latitude: $latitude, longitude: $longitude),
                )
                : NoticeOperation::execute(id: $id);
        } catch (\Throwable $e) {
            Log::error('Commu notice request failed.', ['exception' => $e]);

            throw new GraphQLClientException(
                'Could not reach the Commu service.',
                ErrorCategory::Upstream,
            );
        }

        // Upstream returns a generic "Internal server error" alongside a null `notice` field
        // for an unknown id, rather than a clean not-found response. errorFree() would treat
        // that as a hard failure, so check the (possibly error-accompanied) data directly:
        // a present-but-null `notice` field usually means not-found. But an expired/invalid
        // bearer token *also* leaves `notice` null, tagged with a distinct "Unauthenticated."
        // error — that must stay Upstream, not get misreported as a 404 for a real post.
        $notice = $result->data?->notice;

        if ($notice === null) {
            if ($result->data === null || self::hasAuthError($result->errors)) {
                Log::error('Commu notice request returned an error.', ['errors' => $result->errors]);

                throw new GraphQLClientException(
                    'The Commu service returned an error.',
                    ErrorCategory::Upstream,
                );
            }

            throw new GraphQLClientException(
                'Help post not found.',
                ErrorCategory::NotFound,
            );
        }

        if ($result->errors !== null) {
            // A notice came back despite accompanying errors — don't fail the request over it
            // (the caller got a usable result), but don't drop the errors silently either.
            Log::warning('Commu notice request returned partial errors alongside a result.', [
                'id' => $id,
                'errors' => $result->errors,
            ]);
        }

        return $this->mapNotice($notice);
    }

    /** @param  array<int, \Spawnia\Sailor\Error\Error>|null  $errors */
    private static function hasAuthError(?array $errors): bool
    {
        foreach ($errors ?? [] as $error) {
            if ($error->message === 'Unauthenticated.') {
                return true;
            }
        }

        return false;
    }

    /** @return array<string, mixed> */
    private function mapNotice(Notice $notice): array
    {
        return [
            'id' => $notice->id,
            'title' => $notice->title,
            'description' => $notice->description,
            'in_return' => $notice->in_return,
            'type' => $notice->type,
            'side' => $notice->side,
            'created_at' => $notice->created_at,
            'distance_to_user' => $notice->distance_to_user,
            'likes' => $notice->likes,
            'image' => $notice->image === null ? null : [
                'url' => $notice->image->url,
            ],
            'position' => NoticeFieldMapper::position($notice->position),
            'categories' => NoticeFieldMapper::categories($notice->categories),
            'owner' => $notice->owner === null ? null : [
                'id' => $notice->owner->id,
                'name' => $notice->owner->name,
                'avatar_url' => $notice->owner->avatar_url,
                'trust_level' => $notice->owner->trust_level,
                'accountVerifications' => NoticeFieldMapper::nonNullList($notice->owner->accountVerifications, static fn ($verification) => [
                    'type' => $verification->type,
                    'completed_at' => $verification->completed_at,
                ]),
            ],
            'company' => $notice->company === null ? null : [
                'id' => $notice->company->id,
                'name' => $notice->company->name,
                'logo_url' => $notice->company->logo_url,
            ],
            'notice_language_versions' => NoticeFieldMapper::nonNullList($notice->notice_language_versions, static fn ($translation) => [
                'title' => $translation->title,
                'description' => $translation->description,
                'in_return' => $translation->in_return,
                'language' => $translation->language,
            ]),
        ];
    }
}
