/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getFile = /* GraphQL */ `
  query GetFile($id: ID!) {
    getFile(id: $id) {
      id
      name
      description
      fileName
      createdAt
      updatedAt
      hashValue
      encyptedValue
      owners
      folder
    }
  }
`;
export const listFiles = /* GraphQL */ `
  query ListFiles(
    $filter: ModelFileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        fileName
        createdAt
        updatedAt
        hashValue
        encyptedValue
        owners
        folder
      }
      nextToken
    }
  }
`;
export const getFolder = /* GraphQL */ `
  query GetFolder($id: ID!) {
    getFolder(id: $id) {
      id
      name
      description
      files
      encyptedValue
      owners
      folder
      createdAt
      updatedAt
    }
  }
`;
export const listFolders = /* GraphQL */ `
  query ListFolders(
    $filter: ModelFolderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFolders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        files
        encyptedValue
        owners
        folder
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
