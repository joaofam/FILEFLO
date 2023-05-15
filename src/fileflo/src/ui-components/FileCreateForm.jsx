/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { File } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button
            size="small"
            variation="link"
            isDisabled={hasError}
            onClick={addItem}
          >
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function FileCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    name: "",
    description: "",
    fileName: "",
    createdAt: "",
    updatedAt: "",
    hashValue: "",
    encyptedValue: "",
    owners: [],
    folder: [],
  };
  const [name, setName] = React.useState(initialValues.name);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [fileName, setFileName] = React.useState(initialValues.fileName);
  const [createdAt, setCreatedAt] = React.useState(initialValues.createdAt);
  const [updatedAt, setUpdatedAt] = React.useState(initialValues.updatedAt);
  const [hashValue, setHashValue] = React.useState(initialValues.hashValue);
  const [encyptedValue, setEncyptedValue] = React.useState(
    initialValues.encyptedValue
  );
  const [owners, setOwners] = React.useState(initialValues.owners);
  const [folder, setFolder] = React.useState(initialValues.folder);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setDescription(initialValues.description);
    setFileName(initialValues.fileName);
    setCreatedAt(initialValues.createdAt);
    setUpdatedAt(initialValues.updatedAt);
    setHashValue(initialValues.hashValue);
    setEncyptedValue(initialValues.encyptedValue);
    setOwners(initialValues.owners);
    setCurrentOwnersValue("");
    setFolder(initialValues.folder);
    setCurrentFolderValue("");
    setErrors({});
  };
  const [currentOwnersValue, setCurrentOwnersValue] = React.useState("");
  const ownersRef = React.createRef();
  const [currentFolderValue, setCurrentFolderValue] = React.useState("");
  const folderRef = React.createRef();
  const validations = {
    name: [],
    description: [],
    fileName: [],
    createdAt: [{ type: "Required" }],
    updatedAt: [{ type: "Required" }],
    hashValue: [],
    encyptedValue: [],
    owners: [],
    folder: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          name,
          description,
          fileName,
          createdAt,
          updatedAt,
          hashValue,
          encyptedValue,
          owners,
          folder,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value.trim() === "") {
              modelFields[key] = undefined;
            }
          });
          await DataStore.save(new File(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "FileCreateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={false}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              description,
              fileName,
              createdAt,
              updatedAt,
              hashValue,
              encyptedValue,
              owners,
              folder,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description: value,
              fileName,
              createdAt,
              updatedAt,
              hashValue,
              encyptedValue,
              owners,
              folder,
            };
            const result = onChange(modelFields);
            value = result?.description ?? value;
          }
          if (errors.description?.hasError) {
            runValidationTasks("description", value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks("description", description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, "description")}
      ></TextField>
      <TextField
        label="File name"
        isRequired={false}
        isReadOnly={false}
        value={fileName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              fileName: value,
              createdAt,
              updatedAt,
              hashValue,
              encyptedValue,
              owners,
              folder,
            };
            const result = onChange(modelFields);
            value = result?.fileName ?? value;
          }
          if (errors.fileName?.hasError) {
            runValidationTasks("fileName", value);
          }
          setFileName(value);
        }}
        onBlur={() => runValidationTasks("fileName", fileName)}
        errorMessage={errors.fileName?.errorMessage}
        hasError={errors.fileName?.hasError}
        {...getOverrideProps(overrides, "fileName")}
      ></TextField>
      <TextField
        label="Created at"
        isRequired={true}
        isReadOnly={false}
        value={createdAt}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              fileName,
              createdAt: value,
              updatedAt,
              hashValue,
              encyptedValue,
              owners,
              folder,
            };
            const result = onChange(modelFields);
            value = result?.createdAt ?? value;
          }
          if (errors.createdAt?.hasError) {
            runValidationTasks("createdAt", value);
          }
          setCreatedAt(value);
        }}
        onBlur={() => runValidationTasks("createdAt", createdAt)}
        errorMessage={errors.createdAt?.errorMessage}
        hasError={errors.createdAt?.hasError}
        {...getOverrideProps(overrides, "createdAt")}
      ></TextField>
      <TextField
        label="Updated at"
        isRequired={true}
        isReadOnly={false}
        value={updatedAt}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              fileName,
              createdAt,
              updatedAt: value,
              hashValue,
              encyptedValue,
              owners,
              folder,
            };
            const result = onChange(modelFields);
            value = result?.updatedAt ?? value;
          }
          if (errors.updatedAt?.hasError) {
            runValidationTasks("updatedAt", value);
          }
          setUpdatedAt(value);
        }}
        onBlur={() => runValidationTasks("updatedAt", updatedAt)}
        errorMessage={errors.updatedAt?.errorMessage}
        hasError={errors.updatedAt?.hasError}
        {...getOverrideProps(overrides, "updatedAt")}
      ></TextField>
      <TextField
        label="Hash value"
        isRequired={false}
        isReadOnly={false}
        value={hashValue}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              fileName,
              createdAt,
              updatedAt,
              hashValue: value,
              encyptedValue,
              owners,
              folder,
            };
            const result = onChange(modelFields);
            value = result?.hashValue ?? value;
          }
          if (errors.hashValue?.hasError) {
            runValidationTasks("hashValue", value);
          }
          setHashValue(value);
        }}
        onBlur={() => runValidationTasks("hashValue", hashValue)}
        errorMessage={errors.hashValue?.errorMessage}
        hasError={errors.hashValue?.hasError}
        {...getOverrideProps(overrides, "hashValue")}
      ></TextField>
      <TextField
        label="Encypted value"
        isRequired={false}
        isReadOnly={false}
        value={encyptedValue}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              fileName,
              createdAt,
              updatedAt,
              hashValue,
              encyptedValue: value,
              owners,
              folder,
            };
            const result = onChange(modelFields);
            value = result?.encyptedValue ?? value;
          }
          if (errors.encyptedValue?.hasError) {
            runValidationTasks("encyptedValue", value);
          }
          setEncyptedValue(value);
        }}
        onBlur={() => runValidationTasks("encyptedValue", encyptedValue)}
        errorMessage={errors.encyptedValue?.errorMessage}
        hasError={errors.encyptedValue?.hasError}
        {...getOverrideProps(overrides, "encyptedValue")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              name,
              description,
              fileName,
              createdAt,
              updatedAt,
              hashValue,
              encyptedValue,
              owners: values,
              folder,
            };
            const result = onChange(modelFields);
            values = result?.owners ?? values;
          }
          setOwners(values);
          setCurrentOwnersValue("");
        }}
        currentFieldValue={currentOwnersValue}
        label={"Owners"}
        items={owners}
        hasError={errors?.owners?.hasError}
        errorMessage={errors?.owners?.errorMessage}
        setFieldValue={setCurrentOwnersValue}
        inputFieldRef={ownersRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Owners"
          isRequired={false}
          isReadOnly={false}
          value={currentOwnersValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.owners?.hasError) {
              runValidationTasks("owners", value);
            }
            setCurrentOwnersValue(value);
          }}
          onBlur={() => runValidationTasks("owners", currentOwnersValue)}
          errorMessage={errors.owners?.errorMessage}
          hasError={errors.owners?.hasError}
          ref={ownersRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "owners")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              name,
              description,
              fileName,
              createdAt,
              updatedAt,
              hashValue,
              encyptedValue,
              owners,
              folder: values,
            };
            const result = onChange(modelFields);
            values = result?.folder ?? values;
          }
          setFolder(values);
          setCurrentFolderValue("");
        }}
        currentFieldValue={currentFolderValue}
        label={"Folder"}
        items={folder}
        hasError={errors?.folder?.hasError}
        errorMessage={errors?.folder?.errorMessage}
        setFieldValue={setCurrentFolderValue}
        inputFieldRef={folderRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Folder"
          isRequired={false}
          isReadOnly={false}
          value={currentFolderValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.folder?.hasError) {
              runValidationTasks("folder", value);
            }
            setCurrentFolderValue(value);
          }}
          onBlur={() => runValidationTasks("folder", currentFolderValue)}
          errorMessage={errors.folder?.errorMessage}
          hasError={errors.folder?.hasError}
          ref={folderRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "folder")}
        ></TextField>
      </ArrayField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
