/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createFile = /* GraphQL */ `
  mutation CreateFile(
    $input: CreateFileInput!
    $condition: ModelFileConditionInput
  ) {
    createFile(input: $input, condition: $condition) {
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
export const updateFile = /* GraphQL */ `
  mutation UpdateFile(
    $input: UpdateFileInput!
    $condition: ModelFileConditionInput
  ) {
    updateFile(input: $input, condition: $condition) {
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
export const deleteFile = /* GraphQL */ `
  mutation DeleteFile(
    $input: DeleteFileInput!
    $condition: ModelFileConditionInput
  ) {
    deleteFile(input: $input, condition: $condition) {
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
export const createFolder = /* GraphQL */ `
  mutation CreateFolder(
    $input: CreateFolderInput!
    $condition: ModelFolderConditionInput
  ) {
    createFolder(input: $input, condition: $condition) {
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
export const updateFolder = /* GraphQL */ `
  mutation UpdateFolder(
    $input: UpdateFolderInput!
    $condition: ModelFolderConditionInput
  ) {
    updateFolder(input: $input, condition: $condition) {
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
export const deleteFolder = /* GraphQL */ `
  mutation DeleteFolder(
    $input: DeleteFolderInput!
    $condition: ModelFolderConditionInput
  ) {
    deleteFolder(input: $input, condition: $condition) {
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
