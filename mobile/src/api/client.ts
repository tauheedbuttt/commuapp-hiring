import { ApolloClient, InMemoryCache } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { Platform } from 'react-native';

/**
 * Android emulators route "localhost" to the emulator itself, not the host
 * machine — 10.0.2.2 is the documented alias for the host's loopback there.
 */
const BACKEND_GRAPHQL_URL = Platform.select({
  android: 'http://10.0.2.2:8000/graphql',
  default: 'http://localhost:8000/graphql',
});

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: BACKEND_GRAPHQL_URL }),
  cache: new InMemoryCache(),
});
