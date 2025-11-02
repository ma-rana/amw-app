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
import { Notification } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";
export default function NotificationCreateForm(props) {
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
    timestamp: "",
    message: "",
    title: "",
    storyId: "",
    StoryName: "",
    inviteCode: "",
    storyImageUrl: "",
    isRead: false,
    isStoryJoined: false,
    redirectUrl: "",
    momentId: "",
  };
  const [timestamp, setTimestamp] = React.useState(initialValues.timestamp);
  const [message, setMessage] = React.useState(initialValues.message);
  const [title, setTitle] = React.useState(initialValues.title);
  const [storyId, setStoryId] = React.useState(initialValues.storyId);
  const [StoryName, setStoryName] = React.useState(initialValues.StoryName);
  const [inviteCode, setInviteCode] = React.useState(initialValues.inviteCode);
  const [storyImageUrl, setStoryImageUrl] = React.useState(
    initialValues.storyImageUrl
  );
  const [isRead, setIsRead] = React.useState(initialValues.isRead);
  const [isStoryJoined, setIsStoryJoined] = React.useState(
    initialValues.isStoryJoined
  );
  const [redirectUrl, setRedirectUrl] = React.useState(
    initialValues.redirectUrl
  );
  const [momentId, setMomentId] = React.useState(initialValues.momentId);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setTimestamp(initialValues.timestamp);
    setMessage(initialValues.message);
    setTitle(initialValues.title);
    setStoryId(initialValues.storyId);
    setStoryName(initialValues.StoryName);
    setInviteCode(initialValues.inviteCode);
    setStoryImageUrl(initialValues.storyImageUrl);
    setIsRead(initialValues.isRead);
    setIsStoryJoined(initialValues.isStoryJoined);
    setRedirectUrl(initialValues.redirectUrl);
    setMomentId(initialValues.momentId);
    setErrors({});
  };
  const validations = {
    timestamp: [],
    message: [],
    title: [],
    storyId: [],
    StoryName: [],
    inviteCode: [],
    storyImageUrl: [],
    isRead: [],
    isStoryJoined: [],
    redirectUrl: [],
    momentId: [],
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
  const convertTimeStampToDate = (ts) => {
    if (Math.abs(Date.now() - ts) < Math.abs(Date.now() - ts * 1000)) {
      return new Date(ts);
    }
    return new Date(ts * 1000);
  };
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
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
          timestamp,
          message,
          title,
          storyId,
          StoryName,
          inviteCode,
          storyImageUrl,
          isRead,
          isStoryJoined,
          redirectUrl,
          momentId,
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
          await DataStore.save(new Notification(modelFields));
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
      {...getOverrideProps(overrides, "NotificationCreateForm")}
      {...rest}
    >
      <TextField
        label="Timestamp"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={timestamp && convertToLocal(convertTimeStampToDate(timestamp))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : Number(new Date(e.target.value));
          if (onChange) {
            const modelFields = {
              timestamp: value,
              message,
              title,
              storyId,
              StoryName,
              inviteCode,
              storyImageUrl,
              isRead,
              isStoryJoined,
              redirectUrl,
              momentId,
            };
            const result = onChange(modelFields);
            value = result?.timestamp ?? value;
          }
          if (errors.timestamp?.hasError) {
            runValidationTasks("timestamp", value);
          }
          setTimestamp(value);
        }}
        onBlur={() => runValidationTasks("timestamp", timestamp)}
        errorMessage={errors.timestamp?.errorMessage}
        hasError={errors.timestamp?.hasError}
        {...getOverrideProps(overrides, "timestamp")}
      ></TextField>
      <TextField
        label="Message"
        isRequired={false}
        isReadOnly={false}
        value={message}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              timestamp,
              message: value,
              title,
              storyId,
              StoryName,
              inviteCode,
              storyImageUrl,
              isRead,
              isStoryJoined,
              redirectUrl,
              momentId,
            };
            const result = onChange(modelFields);
            value = result?.message ?? value;
          }
          if (errors.message?.hasError) {
            runValidationTasks("message", value);
          }
          setMessage(value);
        }}
        onBlur={() => runValidationTasks("message", message)}
        errorMessage={errors.message?.errorMessage}
        hasError={errors.message?.hasError}
        {...getOverrideProps(overrides, "message")}
      ></TextField>
      <TextField
        label="Title"
        isRequired={false}
        isReadOnly={false}
        value={title}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              timestamp,
              message,
              title: value,
              storyId,
              StoryName,
              inviteCode,
              storyImageUrl,
              isRead,
              isStoryJoined,
              redirectUrl,
              momentId,
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
        label="Story id"
        isRequired={false}
        isReadOnly={false}
        value={storyId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              timestamp,
              message,
              title,
              storyId: value,
              StoryName,
              inviteCode,
              storyImageUrl,
              isRead,
              isStoryJoined,
              redirectUrl,
              momentId,
            };
            const result = onChange(modelFields);
            value = result?.storyId ?? value;
          }
          if (errors.storyId?.hasError) {
            runValidationTasks("storyId", value);
          }
          setStoryId(value);
        }}
        onBlur={() => runValidationTasks("storyId", storyId)}
        errorMessage={errors.storyId?.errorMessage}
        hasError={errors.storyId?.hasError}
        {...getOverrideProps(overrides, "storyId")}
      ></TextField>
      <TextField
        label="Story name"
        isRequired={false}
        isReadOnly={false}
        value={StoryName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              timestamp,
              message,
              title,
              storyId,
              StoryName: value,
              inviteCode,
              storyImageUrl,
              isRead,
              isStoryJoined,
              redirectUrl,
              momentId,
            };
            const result = onChange(modelFields);
            value = result?.StoryName ?? value;
          }
          if (errors.StoryName?.hasError) {
            runValidationTasks("StoryName", value);
          }
          setStoryName(value);
        }}
        onBlur={() => runValidationTasks("StoryName", StoryName)}
        errorMessage={errors.StoryName?.errorMessage}
        hasError={errors.StoryName?.hasError}
        {...getOverrideProps(overrides, "StoryName")}
      ></TextField>
      <TextField
        label="Invite code"
        isRequired={false}
        isReadOnly={false}
        value={inviteCode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              timestamp,
              message,
              title,
              storyId,
              StoryName,
              inviteCode: value,
              storyImageUrl,
              isRead,
              isStoryJoined,
              redirectUrl,
              momentId,
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
        label="Story image url"
        isRequired={false}
        isReadOnly={false}
        value={storyImageUrl}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              timestamp,
              message,
              title,
              storyId,
              StoryName,
              inviteCode,
              storyImageUrl: value,
              isRead,
              isStoryJoined,
              redirectUrl,
              momentId,
            };
            const result = onChange(modelFields);
            value = result?.storyImageUrl ?? value;
          }
          if (errors.storyImageUrl?.hasError) {
            runValidationTasks("storyImageUrl", value);
          }
          setStoryImageUrl(value);
        }}
        onBlur={() => runValidationTasks("storyImageUrl", storyImageUrl)}
        errorMessage={errors.storyImageUrl?.errorMessage}
        hasError={errors.storyImageUrl?.hasError}
        {...getOverrideProps(overrides, "storyImageUrl")}
      ></TextField>
      <SwitchField
        label="Is read"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isRead}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              timestamp,
              message,
              title,
              storyId,
              StoryName,
              inviteCode,
              storyImageUrl,
              isRead: value,
              isStoryJoined,
              redirectUrl,
              momentId,
            };
            const result = onChange(modelFields);
            value = result?.isRead ?? value;
          }
          if (errors.isRead?.hasError) {
            runValidationTasks("isRead", value);
          }
          setIsRead(value);
        }}
        onBlur={() => runValidationTasks("isRead", isRead)}
        errorMessage={errors.isRead?.errorMessage}
        hasError={errors.isRead?.hasError}
        {...getOverrideProps(overrides, "isRead")}
      ></SwitchField>
      <SwitchField
        label="Is story joined"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isStoryJoined}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              timestamp,
              message,
              title,
              storyId,
              StoryName,
              inviteCode,
              storyImageUrl,
              isRead,
              isStoryJoined: value,
              redirectUrl,
              momentId,
            };
            const result = onChange(modelFields);
            value = result?.isStoryJoined ?? value;
          }
          if (errors.isStoryJoined?.hasError) {
            runValidationTasks("isStoryJoined", value);
          }
          setIsStoryJoined(value);
        }}
        onBlur={() => runValidationTasks("isStoryJoined", isStoryJoined)}
        errorMessage={errors.isStoryJoined?.errorMessage}
        hasError={errors.isStoryJoined?.hasError}
        {...getOverrideProps(overrides, "isStoryJoined")}
      ></SwitchField>
      <TextField
        label="Redirect url"
        isRequired={false}
        isReadOnly={false}
        value={redirectUrl}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              timestamp,
              message,
              title,
              storyId,
              StoryName,
              inviteCode,
              storyImageUrl,
              isRead,
              isStoryJoined,
              redirectUrl: value,
              momentId,
            };
            const result = onChange(modelFields);
            value = result?.redirectUrl ?? value;
          }
          if (errors.redirectUrl?.hasError) {
            runValidationTasks("redirectUrl", value);
          }
          setRedirectUrl(value);
        }}
        onBlur={() => runValidationTasks("redirectUrl", redirectUrl)}
        errorMessage={errors.redirectUrl?.errorMessage}
        hasError={errors.redirectUrl?.hasError}
        {...getOverrideProps(overrides, "redirectUrl")}
      ></TextField>
      <TextField
        label="Moment id"
        isRequired={false}
        isReadOnly={false}
        value={momentId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              timestamp,
              message,
              title,
              storyId,
              StoryName,
              inviteCode,
              storyImageUrl,
              isRead,
              isStoryJoined,
              redirectUrl,
              momentId: value,
            };
            const result = onChange(modelFields);
            value = result?.momentId ?? value;
          }
          if (errors.momentId?.hasError) {
            runValidationTasks("momentId", value);
          }
          setMomentId(value);
        }}
        onBlur={() => runValidationTasks("momentId", momentId)}
        errorMessage={errors.momentId?.errorMessage}
        hasError={errors.momentId?.hasError}
        {...getOverrideProps(overrides, "momentId")}
      ></TextField>
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
