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
  SwitchField,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { Story } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";
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
  runValidationTasks,
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
    const { hasError } = runValidationTasks();
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
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function StoryCreateForm(props) {
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
    title: "",
    inviteCode: "",
    inviteCodeForOwner: "",
    imageUrl: "",
    userId: "",
    userIds: [],
    locked: false,
  };
  const [title, setTitle] = React.useState(initialValues.title);
  const [inviteCode, setInviteCode] = React.useState(initialValues.inviteCode);
  const [inviteCodeForOwner, setInviteCodeForOwner] = React.useState(
    initialValues.inviteCodeForOwner
  );
  const [imageUrl, setImageUrl] = React.useState(initialValues.imageUrl);
  const [userId, setUserId] = React.useState(initialValues.userId);
  const [userIds, setUserIds] = React.useState(initialValues.userIds);
  const [locked, setLocked] = React.useState(initialValues.locked);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setTitle(initialValues.title);
    setInviteCode(initialValues.inviteCode);
    setInviteCodeForOwner(initialValues.inviteCodeForOwner);
    setImageUrl(initialValues.imageUrl);
    setUserId(initialValues.userId);
    setUserIds(initialValues.userIds);
    setCurrentUserIdsValue("");
    setLocked(initialValues.locked);
    setErrors({});
  };
  const [currentUserIdsValue, setCurrentUserIdsValue] = React.useState("");
  const userIdsRef = React.createRef();
  const validations = {
    title: [{ type: "Required" }],
    inviteCode: [{ type: "Required" }],
    inviteCodeForOwner: [],
    imageUrl: [{ type: "URL" }],
    userId: [],
    userIds: [],
    locked: [],
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
          title,
          inviteCode,
          inviteCodeForOwner,
          imageUrl,
          userId,
          userIds,
          locked,
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
          await DataStore.save(new Story(modelFields));
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
      {...getOverrideProps(overrides, "StoryCreateForm")}
      {...rest}
    >
      <TextField
        label="Title"
        isRequired={true}
        isReadOnly={false}
        value={title}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title: value,
              inviteCode,
              inviteCodeForOwner,
              imageUrl,
              userId,
              userIds,
              locked,
            };
            const result = onChange(modelFields);
            value = result?.title ?? value;
          }
          if (errors.title?.hasError) {
            runValidationTasks("title", value);
          }
          setTitle(value);
        }}
        onBlur={() => runValidationTasks("title", title)}
        errorMessage={errors.title?.errorMessage}
        hasError={errors.title?.hasError}
        {...getOverrideProps(overrides, "title")}
      ></TextField>
      <TextField
        label="Invite code"
        isRequired={true}
        isReadOnly={false}
        value={inviteCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              inviteCode: value,
              inviteCodeForOwner,
              imageUrl,
              userId,
              userIds,
              locked,
            };
            const result = onChange(modelFields);
            value = result?.inviteCode ?? value;
          }
          if (errors.inviteCode?.hasError) {
            runValidationTasks("inviteCode", value);
          }
          setInviteCode(value);
        }}
        onBlur={() => runValidationTasks("inviteCode", inviteCode)}
        errorMessage={errors.inviteCode?.errorMessage}
        hasError={errors.inviteCode?.hasError}
        {...getOverrideProps(overrides, "inviteCode")}
      ></TextField>
      <TextField
        label="Invite code for owner"
        isRequired={false}
        isReadOnly={false}
        value={inviteCodeForOwner}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              inviteCode,
              inviteCodeForOwner: value,
              imageUrl,
              userId,
              userIds,
              locked,
            };
            const result = onChange(modelFields);
            value = result?.inviteCodeForOwner ?? value;
          }
          if (errors.inviteCodeForOwner?.hasError) {
            runValidationTasks("inviteCodeForOwner", value);
          }
          setInviteCodeForOwner(value);
        }}
        onBlur={() =>
          runValidationTasks("inviteCodeForOwner", inviteCodeForOwner)
        }
        errorMessage={errors.inviteCodeForOwner?.errorMessage}
        hasError={errors.inviteCodeForOwner?.hasError}
        {...getOverrideProps(overrides, "inviteCodeForOwner")}
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
              title,
              inviteCode,
              inviteCodeForOwner,
              imageUrl: value,
              userId,
              userIds,
              locked,
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
      <TextField
        label="User id"
        isRequired={false}
        isReadOnly={false}
        value={userId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              inviteCode,
              inviteCodeForOwner,
              imageUrl,
              userId: value,
              userIds,
              locked,
            };
            const result = onChange(modelFields);
            value = result?.userId ?? value;
          }
          if (errors.userId?.hasError) {
            runValidationTasks("userId", value);
          }
          setUserId(value);
        }}
        onBlur={() => runValidationTasks("userId", userId)}
        errorMessage={errors.userId?.errorMessage}
        hasError={errors.userId?.hasError}
        {...getOverrideProps(overrides, "userId")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              title,
              inviteCode,
              inviteCodeForOwner,
              imageUrl,
              userId,
              userIds: values,
              locked,
            };
            const result = onChange(modelFields);
            values = result?.userIds ?? values;
          }
          setUserIds(values);
          setCurrentUserIdsValue("");
        }}
        currentFieldValue={currentUserIdsValue}
        label={"User ids"}
        items={userIds}
        hasError={errors?.userIds?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("userIds", currentUserIdsValue)
        }
        errorMessage={errors?.userIds?.errorMessage}
        setFieldValue={setCurrentUserIdsValue}
        inputFieldRef={userIdsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="User ids"
          isRequired={false}
          isReadOnly={false}
          value={currentUserIdsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.userIds?.hasError) {
              runValidationTasks("userIds", value);
            }
            setCurrentUserIdsValue(value);
          }}
          onBlur={() => runValidationTasks("userIds", currentUserIdsValue)}
          errorMessage={errors.userIds?.errorMessage}
          hasError={errors.userIds?.hasError}
          ref={userIdsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "userIds")}
        ></TextField>
      </ArrayField>
      <SwitchField
        label="Locked"
        defaultChecked={false}
        isDisabled={false}
        isChecked={locked}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              title,
              inviteCode,
              inviteCodeForOwner,
              imageUrl,
              userId,
              userIds,
              locked: value,
            };
            const result = onChange(modelFields);
            value = result?.locked ?? value;
          }
          if (errors.locked?.hasError) {
            runValidationTasks("locked", value);
          }
          setLocked(value);
        }}
        onBlur={() => runValidationTasks("locked", locked)}
        errorMessage={errors.locked?.errorMessage}
        hasError={errors.locked?.hasError}
        {...getOverrideProps(overrides, "locked")}
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
