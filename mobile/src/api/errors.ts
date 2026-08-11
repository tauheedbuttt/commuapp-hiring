import { CombinedGraphQLErrors } from '@apollo/client/errors';

/**
 * Apollo's default errorPolicy ('none') rejects the query promise on a
 * GraphQL error rather than resolving it with `.error` populated — so
 * callers read the category from the caught value, not a resolved result.
 */
export function getGraphQLErrorCategory(error: unknown): string | undefined {
  if (!CombinedGraphQLErrors.is(error)) {
    return undefined;
  }

  const category = error.errors[0]?.extensions?.category;
  return typeof category === 'string' ? category : undefined;
}
