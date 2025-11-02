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
import { Moment } from "../models";
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
export default function MomentCreateForm(props) {
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
    order: "",
    mediaId: "",
    description: "",
    userId: "",
    taggedUserIds: [],
    timestamp: "",
    storyId: "",
    reportedCount: "",
  };
  const [title, setTitle] = React.useState(initialValues.title);
  const [order, setOrder] = React.useState(initialValues.order);
  const [mediaId, setMediaId] = React.useState(initialValues.mediaId);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [userId, setUserId] = React.useState(initialValues.userId);
  const [taggedUserIds, setTaggedUserIds] = React.useState(
    initialValues.taggedUserIds
  );
  const [timestamp, setTimestamp] = React.useState(initialValues.timestamp);
  const [storyId, setStoryId] = React.useState(initialValues.storyId);
  const [reportedCount, setReportedCount] = React.useState(
    initialValues.reportedCount
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setTitle(initialValues.title);
    setOrder(initialValues.order);
    setMediaId(initialValues.mediaId);
    setDescription(initialValues.description);
    setUserId(initialValues.userId);
    setTaggedUserIds(initialValues.taggedUserIds);
    setCurrentTaggedUserIdsValue("");
    setTimestamp(initialValues.timestamp);
    setStoryId(initialValues.storyId);
    setReportedCount(initialValues.reportedCount);
    setErrors({});
  };
  const [currentTaggedUserIdsValue, setCurrentTaggedUserIdsValue] =
    React.useState("");
  const taggedUserIdsRef = React.createRef();
  const validations = {
    title: [],
    order: [],
    mediaId: [],
    description: [],
    userId: [],
    taggedUserIds: [],
    timestamp: [],
    storyId: [],
    reportedCount: [],
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
          title,
          order,
          mediaId,
          description,
          userId,
          taggedUserIds,
          timestamp,
          storyId,
          reportedCount,
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
          await DataStore.save(new Moment(modelFields));
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
      {...getOverrideProps(overrides, "MomentCreateForm")}
      {...rest}
    >
      <TextField
        label="Title"
        isRequired={false}
        isReadOnly={false}
        value={title}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title: value,
              order,
              mediaId,
              description,
              userId,
              taggedUserIds,
              timestamp,
              storyId,
              reportedCount,
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
        label="Order"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={order}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              title,
              order: value,
              mediaId,
              description,
              userId,
              taggedUserIds,
              timestamp,
              storyId,
              reportedCount,
            };
            const result = onChange(modelFields);
            value = result?.order ?? value;
          }
          if (errors.order?.hasError) {
            runValidationTasks("order", value);
          }
          setOrder(value);
        }}
        onBlur={() => runValidationTasks("order", order)}
        errorMessage={errors.order?.errorMessage}
        hasError={errors.order?.hasError}
        {...getOverrideProps(overrides, "order")}
      ></TextField>
      <TextField
        label="Media id"
        isRequired={false}
        isReadOnly={false}
        value={mediaId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              order,
              mediaId: value,
              description,
              userId,
              taggedUserIds,
              timestamp,
              storyId,
              reportedCount,
            };
            const result = onChange(modelFields);
            value = result?.mediaId ?? value;
          }
          if (errors.mediaId?.hasError) {
            runValidationTasks("mediaId", value);
          }
          setMediaId(value);
        }}
        onBlur={() => runValidationTasks("mediaId", mediaId)}
        errorMessage={errors.mediaId?.errorMessage}
        hasError={errors.mediaId?.hasError}
        {...getOverrideProps(overrides, "mediaId")}
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
              title,
              order,
              mediaId,
              description: value,
              userId,
              taggedUserIds,
              timestamp,
              storyId,
              reportedCount,
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
        label="User id"
        isRequired={false}
        isReadOnly={false}
        value={userId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              order,
              mediaId,
              description,
              userId: value,
              taggedUserIds,
              timestamp,
              storyId,
              reportedCount,
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
              order,
              mediaId,
              description,
              userId,
              taggedUserIds: values,
              timestamp,
              storyId,
              reportedCount,
            };
            const result = onChange(modelFields);
            values = result?.taggedUserIds ?? values;
          }
          setTaggedUserIds(values);
          setCurrentTaggedUserIdsValue("");
        }}
        currentFieldValue={currentTaggedUserIdsValue}
        label={"Tagged user ids"}
        items={taggedUserIds}
        hasError={errors?.taggedUserIds?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("taggedUserIds", currentTaggedUserIdsValue)
        }
        errorMessage={errors?.taggedUserIds?.errorMessage}
        setFieldValue={setCurrentTaggedUserIdsValue}
        inputFieldRef={taggedUserIdsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Tagged user ids"
          isRequired={false}
          isReadOnly={false}
          value={currentTaggedUserIdsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.taggedUserIds?.hasError) {
              runValidationTasks("taggedUserIds", value);
            }
            setCurrentTaggedUserIdsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("taggedUserIds", currentTaggedUserIdsValue)
          }
          errorMessage={errors.taggedUserIds?.errorMessage}
          hasError={errors.taggedUserIds?.hasError}
          ref={taggedUserIdsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "taggedUserIds")}
        ></TextField>
      </ArrayField>
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
              title,
              order,
              mediaId,
              description,
              userId,
              taggedUserIds,
              timestamp: value,
              storyId,
              reportedCount,
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
        label="Story id"
        isRequired={false}
        isReadOnly={false}
        value={storyId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              order,
              mediaId,
              description,
              userId,
              taggedUserIds,
              timestamp,
              storyId: value,
              reportedCount,
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
        label="Reported count"
        isRequired={false}
        isReadOnly={false}
        value={reportedCount}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              order,
              mediaId,
              description,
              userId,
              taggedUserIds,
              timestamp,
              storyId,
              reportedCount: value,
            };
            const result = onChange(modelFields);
            value = result?.reportedCount ?? value;
          }
          if (errors.reportedCount?.hasError) {
            runValidationTasks("reportedCount", value);
          }
          setReportedCount(value);
        }}
        onBlur={() => runValidationTasks("reportedCount", reportedCount)}
        errorMessage={errors.reportedCount?.errorMessage}
        hasError={errors.reportedCount?.hasError}
        {...getOverrideProps(overrides, "reportedCount")}
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
