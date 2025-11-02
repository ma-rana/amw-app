/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { Media } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";
export default function MediaUpdateForm(props) {
  const {
    id: idProp,
    media: mediaModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    parentId: "",
    timestamp: "",
    imageUrl: "",
    videoUrl: "",
    mediaSizeMegaBytes: "",
    isVideo: false,
  };
  const [parentId, setParentId] = React.useState(initialValues.parentId);
  const [timestamp, setTimestamp] = React.useState(initialValues.timestamp);
  const [imageUrl, setImageUrl] = React.useState(initialValues.imageUrl);
  const [videoUrl, setVideoUrl] = React.useState(initialValues.videoUrl);
  const [mediaSizeMegaBytes, setMediaSizeMegaBytes] = React.useState(
    initialValues.mediaSizeMegaBytes
  );
  const [isVideo, setIsVideo] = React.useState(initialValues.isVideo);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = mediaRecord
      ? { ...initialValues, ...mediaRecord }
      : initialValues;
    setParentId(cleanValues.parentId);
    setTimestamp(cleanValues.timestamp);
    setImageUrl(cleanValues.imageUrl);
    setVideoUrl(cleanValues.videoUrl);
    setMediaSizeMegaBytes(cleanValues.mediaSizeMegaBytes);
    setIsVideo(cleanValues.isVideo);
    setErrors({});
  };
  const [mediaRecord, setMediaRecord] = React.useState(mediaModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(Media, idProp)
        : mediaModelProp;
      setMediaRecord(record);
    };
    queryData();
  }, [idProp, mediaModelProp]);
  React.useEffect(resetStateValues, [mediaRecord]);
  const validations = {
    parentId: [],
    timestamp: [],
    imageUrl: [{ type: "URL" }],
    videoUrl: [{ type: "URL" }],
    mediaSizeMegaBytes: [],
    isVideo: [],
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
          parentId,
          timestamp,
          imageUrl,
          videoUrl,
          mediaSizeMegaBytes,
          isVideo,
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
          await DataStore.save(
            Media.copyOf(mediaRecord, (updated) => {
              Object.assign(updated, modelFields);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "MediaUpdateForm")}
      {...rest}
    >
      <TextField
        label="Parent id"
        isRequired={false}
        isReadOnly={false}
        value={parentId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              parentId: value,
              timestamp,
              imageUrl,
              videoUrl,
              mediaSizeMegaBytes,
              isVideo,
            };
            const result = onChange(modelFields);
            value = result?.parentId ?? value;
          }
          if (errors.parentId?.hasError) {
            runValidationTasks("parentId", value);
          }
          setParentId(value);
        }}
        onBlur={() => runValidationTasks("parentId", parentId)}
        errorMessage={errors.parentId?.errorMessage}
        hasError={errors.parentId?.hasError}
        {...getOverrideProps(overrides, "parentId")}
      ></TextField>
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
              parentId,
              timestamp: value,
              imageUrl,
              videoUrl,
              mediaSizeMegaBytes,
              isVideo,
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
        label="Image url"
        isRequired={false}
        isReadOnly={false}
        value={imageUrl}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              parentId,
              timestamp,
              imageUrl: value,
              videoUrl,
              mediaSizeMegaBytes,
              isVideo,
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
        label="Video url"
        isRequired={false}
        isReadOnly={false}
        value={videoUrl}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              parentId,
              timestamp,
              imageUrl,
              videoUrl: value,
              mediaSizeMegaBytes,
              isVideo,
            };
            const result = onChange(modelFields);
            value = result?.videoUrl ?? value;
          }
          if (errors.videoUrl?.hasError) {
            runValidationTasks("videoUrl", value);
          }
          setVideoUrl(value);
        }}
        onBlur={() => runValidationTasks("videoUrl", videoUrl)}
        errorMessage={errors.videoUrl?.errorMessage}
        hasError={errors.videoUrl?.hasError}
        {...getOverrideProps(overrides, "videoUrl")}
      ></TextField>
      <TextField
        label="Media size mega bytes"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={mediaSizeMegaBytes}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              parentId,
              timestamp,
              imageUrl,
              videoUrl,
              mediaSizeMegaBytes: value,
              isVideo,
            };
            const result = onChange(modelFields);
            value = result?.mediaSizeMegaBytes ?? value;
          }
          if (errors.mediaSizeMegaBytes?.hasError) {
            runValidationTasks("mediaSizeMegaBytes", value);
          }
          setMediaSizeMegaBytes(value);
        }}
        onBlur={() =>
          runValidationTasks("mediaSizeMegaBytes", mediaSizeMegaBytes)
        }
        errorMessage={errors.mediaSizeMegaBytes?.errorMessage}
        hasError={errors.mediaSizeMegaBytes?.hasError}
        {...getOverrideProps(overrides, "mediaSizeMegaBytes")}
      ></TextField>
      <SwitchField
        label="Is video"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isVideo}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              parentId,
              timestamp,
              imageUrl,
              videoUrl,
              mediaSizeMegaBytes,
              isVideo: value,
            };
            const result = onChange(modelFields);
            value = result?.isVideo ?? value;
          }
          if (errors.isVideo?.hasError) {
            runValidationTasks("isVideo", value);
          }
          setIsVideo(value);
        }}
        onBlur={() => runValidationTasks("isVideo", isVideo)}
        errorMessage={errors.isVideo?.errorMessage}
        hasError={errors.isVideo?.hasError}
        {...getOverrideProps(overrides, "isVideo")}
      ></SwitchField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || mediaModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || mediaModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
