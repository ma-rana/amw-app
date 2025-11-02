/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Report } from "../models";
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
export declare type ReportUpdateFormInputValues = {
    name?: string;
    userID?: string;
    email?: string;
    reason?: string;
    reportedContent?: string;
};
export declare type ReportUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    userID?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    reason?: ValidationFunction<string>;
    reportedContent?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ReportUpdateFormOverridesProps = {
    ReportUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    userID?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    reason?: PrimitiveOverrideProps<TextFieldProps>;
    reportedContent?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ReportUpdateFormProps = React.PropsWithChildren<{
    overrides?: ReportUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    report?: Report;
    onSubmit?: (fields: ReportUpdateFormInputValues) => ReportUpdateFormInputValues;
    onSuccess?: (fields: ReportUpdateFormInputValues) => void;
    onError?: (fields: ReportUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ReportUpdateFormInputValues) => ReportUpdateFormInputValues;
    onValidate?: ReportUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ReportUpdateForm(props: ReportUpdateFormProps): React.ReactElement;
