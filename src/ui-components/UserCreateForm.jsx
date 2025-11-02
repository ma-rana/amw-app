/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

 
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { User } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";
export default function UserCreateForm(props) {
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
    lastName: "",
    funFacts: "",
    bio: "",
    sharingMoments: "",
    imageUrl: "",
    isAccountProtected: false,
  };
  const [name, setName] = React.useState(initialValues.name);
  const [lastName, setLastName] = React.useState(initialValues.lastName);
  const [funFacts, setFunFacts] = React.useState(initialValues.funFacts);
  const [bio, setBio] = React.useState(initialValues.bio);
  const [sharingMoments, setSharingMoments] = React.useState(
    initialValues.sharingMoments
  );
  const [imageUrl, setImageUrl] = React.useState(initialValues.imageUrl);
  const [isAccountProtected, setIsAccountProtected] = React.useState(
    initialValues.isAccountProtected
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setLastName(initialValues.lastName);
    setFunFacts(initialValues.funFacts);
    setBio(initialValues.bio);
    setSharingMoments(initialValues.sharingMoments);
    setImageUrl(initialValues.imageUrl);
    setIsAccountProtected(initialValues.isAccountProtected);
    setErrors({});
  };
  const validations = {
    name: [],
    lastName: [],
    funFacts: [],
    bio: [],
    sharingMoments: [],
    imageUrl: [{ type: "URL" }],
    isAccountProtected: [],
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
          lastName,
          funFacts,
          bio,
          sharingMoments,
          imageUrl,
          isAccountProtected,
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
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await DataStore.save(new User(modelFields));
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
      {...getOverrideProps(overrides, "UserCreateForm")}
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
              lastName,
              funFacts,
              bio,
              sharingMoments,
              imageUrl,
              isAccountProtected,
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
        label="Last name"
        isRequired={false}
        isReadOnly={false}
        value={lastName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              lastName: value,
              funFacts,
              bio,
              sharingMoments,
              imageUrl,
              isAccountProtected,
            };
            const result = onChange(modelFields);
            value = result?.lastName ?? value;
          }
          if (errors.lastName?.hasError) {
            runValidationTasks("lastName", value);
          }
          setLastName(value);
        }}
        onBlur={() => runValidationTasks("lastName", lastName)}
        errorMessage={errors.lastName?.errorMessage}
        hasError={errors.lastName?.hasError}
        {...getOverrideProps(overrides, "lastName")}
      ></TextField>
      <TextField
        label="Fun facts"
        isRequired={false}
        isReadOnly={false}
        value={funFacts}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              lastName,
              funFacts: value,
              bio,
              sharingMoments,
              imageUrl,
              isAccountProtected,
            };
            const result = onChange(modelFields);
            value = result?.funFacts ?? value;
          }
          if (errors.funFacts?.hasError) {
            runValidationTasks("funFacts", value);
          }
          setFunFacts(value);
        }}
        onBlur={() => runValidationTasks("funFacts", funFacts)}
        errorMessage={errors.funFacts?.errorMessage}
        hasError={errors.funFacts?.hasError}
        {...getOverrideProps(overrides, "funFacts")}
      ></TextField>
      <TextField
        label="Bio"
        isRequired={false}
        isReadOnly={false}
        value={bio}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              lastName,
              funFacts,
              bio: value,
              sharingMoments,
              imageUrl,
              isAccountProtected,
            };
            const result = onChange(modelFields);
            value = result?.bio ?? value;
          }
          if (errors.bio?.hasError) {
            runValidationTasks("bio", value);
          }
          setBio(value);
        }}
        onBlur={() => runValidationTasks("bio", bio)}
        errorMessage={errors.bio?.errorMessage}
        hasError={errors.bio?.hasError}
        {...getOverrideProps(overrides, "bio")}
      ></TextField>
      <TextField
        label="Sharing moments"
        isRequired={false}
        isReadOnly={false}
        value={sharingMoments}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              lastName,
              funFacts,
              bio,
              sharingMoments: value,
              imageUrl,
              isAccountProtected,
            };
            const result = onChange(modelFields);
            value = result?.sharingMoments ?? value;
          }
          if (errors.sharingMoments?.hasError) {
            runValidationTasks("sharingMoments", value);
          }
          setSharingMoments(value);
        }}
        onBlur={() => runValidationTasks("sharingMoments", sharingMoments)}
        errorMessage={errors.sharingMoments?.errorMessage}
        hasError={errors.sharingMoments?.hasError}
        {...getOverrideProps(overrides, "sharingMoments")}
      ></TextField>
      <TextField
        label="Image url"
        isRequired={false}
        isReadOnly={false}
        value={imageUrl}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              lastName,
              funFacts,
              bio,
              sharingMoments,
              imageUrl: value,
              isAccountProtected,
            };
            const result = onChange(modelFields);
            value = result?.imageUrl ?? value;
          }
          if (errors.imageUrl?.hasError) {
            runValidationTasks("imageUrl", value);
          }
          setImageUrl(value);
        }}
        onBlur={() => runValidationTasks("imageUrl", imageUrl)}
        errorMessage={errors.imageUrl?.errorMessage}
        hasError={errors.imageUrl?.hasError}
        {...getOverrideProps(overrides, "imageUrl")}
      ></TextField>
      <SwitchField
        label="Is account protected"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isAccountProtected}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              name,
              lastName,
              funFacts,
              bio,
              sharingMoments,
              imageUrl,
              isAccountProtected: value,
            };
            const result = onChange(modelFields);
            value = result?.isAccountProtected ?? value;
          }
          if (errors.isAccountProtected?.hasError) {
            runValidationTasks("isAccountProtected", value);
          }
          setIsAccountProtected(value);
        }}
        onBlur={() =>
          runValidationTasks("isAccountProtected", isAccountProtected)
        }
        errorMessage={errors.isAccountProtected?.errorMessage}
        hasError={errors.isAccountProtected?.hasError}
        {...getOverrideProps(overrides, "isAccountProtected")}
      ></SwitchField>
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
