/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateFile = /* GraphQL */ `
  subscription OnCreateFile($filter: ModelSubscriptionFileFilterInput) {
    onCreateFile(filter: $filter) {
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
export const onUpdateFile = /* GraphQL */ `
  subscription OnUpdateFile($filter: ModelSubscriptionFileFilterInput) {
    onUpdateFile(filter: $filter) {
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
export const onDeleteFile = /* GraphQL */ `
  subscription OnDeleteFile($filter: ModelSubscriptionFileFilterInput) {
    onDeleteFile(filter: $filter) {
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
export const onCreateFolder = /* GraphQL */ `
  subscription OnCreateFolder($filter: ModelSubscriptionFolderFilterInput) {
    onCreateFolder(filter: $filter) {
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
export const onUpdateFolder = /* GraphQL */ `
  subscription OnUpdateFolder($filter: ModelSubscriptionFolderFilterInput) {
    onUpdateFolder(filter: $filter) {
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
export const onDeleteFolder = /* GraphQL */ `
  subscription OnDeleteFolder($filter: ModelSubscriptionFolderFilterInput) {
    onDeleteFolder(filter: $filter) {
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
