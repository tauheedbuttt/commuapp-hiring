/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query AreaSummary($town: String!, $lat: Float!, $long: Float!, $distance: Int!) {\n  areaSummary(town: $town, lat: $lat, long: $long, distance: $distance) {\n    summary\n  }\n}": typeof types.AreaSummaryDocument,
    "query GeocodeTown($town: String!) {\n  geocodeTown(town: $town) {\n    town\n    latitude\n    longitude\n  }\n}": typeof types.GeocodeTownDocument,
    "query Notice($id: ID!, $lat: Float, $long: Float) {\n  notice(id: $id, lat: $lat, long: $long) {\n    id\n    title\n    description\n    in_return\n    type\n    side\n    created_at\n    expires_at\n    distance_to_user\n    likes\n    image {\n      url\n    }\n    position {\n      latitude\n      longitude\n    }\n    categories {\n      main {\n        id\n        key\n      }\n      sub {\n        id\n        key\n      }\n    }\n    owner {\n      id\n      name\n      avatar_url\n    }\n    company {\n      id\n      name\n      logo_url\n    }\n  }\n}": typeof types.NoticeDocument,
    "query NoticesWhereDistance($lat: Float!, $long: Float!, $distance: Int!, $first: Int!, $page: Int) {\n  noticesWhereDistance(\n    lat: $lat\n    long: $long\n    distance: $distance\n    first: $first\n    page: $page\n  ) {\n    paginatorInfo {\n      count\n      currentPage\n      hasMorePages\n    }\n    data {\n      id\n      title\n      description\n      type\n      created_at\n      distance_to_user\n      categories {\n        main {\n          key\n        }\n      }\n      image {\n        url\n      }\n      owner {\n        id\n        name\n        avatar_url\n      }\n      company {\n        id\n        name\n        logo_url\n      }\n    }\n  }\n}": typeof types.NoticesWhereDistanceDocument,
};
const documents: Documents = {
    "query AreaSummary($town: String!, $lat: Float!, $long: Float!, $distance: Int!) {\n  areaSummary(town: $town, lat: $lat, long: $long, distance: $distance) {\n    summary\n  }\n}": types.AreaSummaryDocument,
    "query GeocodeTown($town: String!) {\n  geocodeTown(town: $town) {\n    town\n    latitude\n    longitude\n  }\n}": types.GeocodeTownDocument,
    "query Notice($id: ID!, $lat: Float, $long: Float) {\n  notice(id: $id, lat: $lat, long: $long) {\n    id\n    title\n    description\n    in_return\n    type\n    side\n    created_at\n    expires_at\n    distance_to_user\n    likes\n    image {\n      url\n    }\n    position {\n      latitude\n      longitude\n    }\n    categories {\n      main {\n        id\n        key\n      }\n      sub {\n        id\n        key\n      }\n    }\n    owner {\n      id\n      name\n      avatar_url\n    }\n    company {\n      id\n      name\n      logo_url\n    }\n  }\n}": types.NoticeDocument,
    "query NoticesWhereDistance($lat: Float!, $long: Float!, $distance: Int!, $first: Int!, $page: Int) {\n  noticesWhereDistance(\n    lat: $lat\n    long: $long\n    distance: $distance\n    first: $first\n    page: $page\n  ) {\n    paginatorInfo {\n      count\n      currentPage\n      hasMorePages\n    }\n    data {\n      id\n      title\n      description\n      type\n      created_at\n      distance_to_user\n      categories {\n        main {\n          key\n        }\n      }\n      image {\n        url\n      }\n      owner {\n        id\n        name\n        avatar_url\n      }\n      company {\n        id\n        name\n        logo_url\n      }\n    }\n  }\n}": types.NoticesWhereDistanceDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query AreaSummary($town: String!, $lat: Float!, $long: Float!, $distance: Int!) {\n  areaSummary(town: $town, lat: $lat, long: $long, distance: $distance) {\n    summary\n  }\n}"): (typeof documents)["query AreaSummary($town: String!, $lat: Float!, $long: Float!, $distance: Int!) {\n  areaSummary(town: $town, lat: $lat, long: $long, distance: $distance) {\n    summary\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GeocodeTown($town: String!) {\n  geocodeTown(town: $town) {\n    town\n    latitude\n    longitude\n  }\n}"): (typeof documents)["query GeocodeTown($town: String!) {\n  geocodeTown(town: $town) {\n    town\n    latitude\n    longitude\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Notice($id: ID!, $lat: Float, $long: Float) {\n  notice(id: $id, lat: $lat, long: $long) {\n    id\n    title\n    description\n    in_return\n    type\n    side\n    created_at\n    expires_at\n    distance_to_user\n    likes\n    image {\n      url\n    }\n    position {\n      latitude\n      longitude\n    }\n    categories {\n      main {\n        id\n        key\n      }\n      sub {\n        id\n        key\n      }\n    }\n    owner {\n      id\n      name\n      avatar_url\n    }\n    company {\n      id\n      name\n      logo_url\n    }\n  }\n}"): (typeof documents)["query Notice($id: ID!, $lat: Float, $long: Float) {\n  notice(id: $id, lat: $lat, long: $long) {\n    id\n    title\n    description\n    in_return\n    type\n    side\n    created_at\n    expires_at\n    distance_to_user\n    likes\n    image {\n      url\n    }\n    position {\n      latitude\n      longitude\n    }\n    categories {\n      main {\n        id\n        key\n      }\n      sub {\n        id\n        key\n      }\n    }\n    owner {\n      id\n      name\n      avatar_url\n    }\n    company {\n      id\n      name\n      logo_url\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query NoticesWhereDistance($lat: Float!, $long: Float!, $distance: Int!, $first: Int!, $page: Int) {\n  noticesWhereDistance(\n    lat: $lat\n    long: $long\n    distance: $distance\n    first: $first\n    page: $page\n  ) {\n    paginatorInfo {\n      count\n      currentPage\n      hasMorePages\n    }\n    data {\n      id\n      title\n      description\n      type\n      created_at\n      distance_to_user\n      categories {\n        main {\n          key\n        }\n      }\n      image {\n        url\n      }\n      owner {\n        id\n        name\n        avatar_url\n      }\n      company {\n        id\n        name\n        logo_url\n      }\n    }\n  }\n}"): (typeof documents)["query NoticesWhereDistance($lat: Float!, $long: Float!, $distance: Int!, $first: Int!, $page: Int) {\n  noticesWhereDistance(\n    lat: $lat\n    long: $long\n    distance: $distance\n    first: $first\n    page: $page\n  ) {\n    paginatorInfo {\n      count\n      currentPage\n      hasMorePages\n    }\n    data {\n      id\n      title\n      description\n      type\n      created_at\n      distance_to_user\n      categories {\n        main {\n          key\n        }\n      }\n      image {\n        url\n      }\n      owner {\n        id\n        name\n        avatar_url\n      }\n      company {\n        id\n        name\n        logo_url\n      }\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;