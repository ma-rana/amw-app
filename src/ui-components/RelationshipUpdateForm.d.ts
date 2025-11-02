/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Relationship } from "../models";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type RelationshipUpdateFormInputValues = {
    relation?: string;
    withUser?: string;
};
export declare type RelationshipUpdateFormValidationValues = {
    relation?: ValidationFunction<string>;
    withUser?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type RelationshipUpdateFormOverridesProps = {
    RelationshipUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    relation?: PrimitiveOverrideProps<TextFieldProps>;
    withUser?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type RelationshipUpdateFormProps = React.PropsWithChildren<{
    overrides?: RelationshipUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    relationship?: Relationship;
    onSubmit?: (fields: RelationshipUpdateFormInputValues) => RelationshipUpdateFormInputValues;
    onSuccess?: (fields: RelationshipUpdateFormInputValues) => void;
    onError?: (fields: RelationshipUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: RelationshipUpdateFormInputValues) => RelationshipUpdateFormInputValues;
    onValidate?: RelationshipUpdateFormValidationValues;
} & React.CSSProperties>;
export default function RelationshipUpdateForm(props: RelationshipUpdateFormProps): React.ReactElement;
