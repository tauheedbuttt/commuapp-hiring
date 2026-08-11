import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import Constants from "expo-constants";

const devServerHost = Constants.expoConfig?.hostUri?.split(":")[0];

function resolveBackendGraphQLUrl(): string {
  if (devServerHost) return `http://${devServerHost}:8000/graphql`;

  const standaloneUrl = process.env.EXPO_PUBLIC_BACKEND_GRAPHQL_URL;
  if (!standaloneUrl) {
    throw new Error(
      "EXPO_PUBLIC_BACKEND_GRAPHQL_URL must be set — no Metro dev-server host available to derive the backend URL from.",
    );
  }
  return standaloneUrl;
}

const BACKEND_GRAPHQL_URL = resolveBackendGraphQLUrl();

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: BACKEND_GRAPHQL_URL }),
  cache: new InMemoryCache(),
});
