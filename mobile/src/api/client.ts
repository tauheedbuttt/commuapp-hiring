import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import Constants from "expo-constants";

const devServerHost = Constants.expoConfig?.hostUri?.split(":")[0];
const BACKEND_GRAPHQL_URL = `http://${devServerHost ?? "localhost"}:8000/graphql`;

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: BACKEND_GRAPHQL_URL }),
  cache: new InMemoryCache(),
});
