/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { Relationship } from "../models";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { DataStore } from "aws-amplify/datastore";
export default function RelationshipUpdateForm(props) {
  const {
    id: idProp,
    relationship: relationshipModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    relation: "",
    withUser: "",
  };
  const [relation, setRelation] = React.useState(initialValues.relation);
  const [withUser, setWithUser] = React.useState(initialValues.withUser);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = relationshipRecord
      ? { ...initialValues, ...relationshipRecord }
      : initialValues;
    setRelation(cleanValues.relation);
    setWithUser(cleanValues.withUser);
    setErrors({});
  };
  const [relationshipRecord, setRelationshipRecord] = React.useState(
    relationshipModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? await DataStore.query(Relationship, idProp)
        : relationshipModelProp;
      setRelationshipRecord(record);
    };
    queryData();
  }, [idProp, relationshipModelProp]);
  React.useEffect(resetStateValues, [relationshipRecord]);
  const validations = {
    relation: [],
    withUser: [{ type: "Required" }],
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
          relation,
          withUser,
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
            Relationship.copyOf(relationshipRecord, (updated) => {
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
      {...getOverrideProps(overrides, "RelationshipUpdateForm")}
      {...rest}
    >
      <TextField
        label="Relation"
        isRequired={false}
        isReadOnly={false}
        value={relation}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              relation: value,
              withUser,
            };
            const result = onChange(modelFields);
            value = result?.relation ?? value;
          }
          if (errors.relation?.hasError) {
            runValidationTasks("relation", value);
          }
          setRelation(value);
        }}
        onBlur={() => runValidationTasks("relation", relation)}
        errorMessage={errors.relation?.errorMessage}
        hasError={errors.relation?.hasError}
        {...getOverrideProps(overrides, "relation")}
      ></TextField>
      <TextField
        label="With user"
        isRequired={true}
        isReadOnly={false}
        value={withUser}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              relation,
              withUser: value,
            };
            const result = onChange(modelFields);
            value = result?.withUser ?? value;
          }
          if (errors.withUser?.hasError) {
            runValidationTasks("withUser", value);
          }
          setWithUser(value);
        }}
        onBlur={() => runValidationTasks("withUser", withUser)}
        errorMessage={errors.withUser?.errorMessage}
        hasError={errors.withUser?.hasError}
        {...getOverrideProps(overrides, "withUser")}
      ></TextField>
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
          isDisabled={!(idProp || relationshipModelProp)}
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
              !(idProp || relationshipModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
