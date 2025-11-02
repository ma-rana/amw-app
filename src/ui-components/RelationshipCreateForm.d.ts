/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type RelationshipCreateFormInputValues = {
    relation?: string;
    withUser?: string;
};
export declare type RelationshipCreateFormValidationValues = {
    relation?: ValidationFunction<string>;
    withUser?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type RelationshipCreateFormOverridesProps = {
    RelationshipCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    relation?: PrimitiveOverrideProps<TextFieldProps>;
    withUser?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type RelationshipCreateFormProps = React.PropsWithChildren<{
    overrides?: RelationshipCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: RelationshipCreateFormInputValues) => RelationshipCreateFormInputValues;
    onSuccess?: (fields: RelationshipCreateFormInputValues) => void;
    onError?: (fields: RelationshipCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: RelationshipCreateFormInputValues) => RelationshipCreateFormInputValues;
    onValidate?: RelationshipCreateFormValidationValues;
} & React.CSSProperties>;
export default function RelationshipCreateForm(props: RelationshipCreateFormProps): React.ReactElement;
