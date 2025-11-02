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
export declare type EmergencyCreateFormInputValues = {
    firstName?: string;
    lastName?: string;
    contact?: string;
    email?: string;
};
export declare type EmergencyCreateFormValidationValues = {
    firstName?: ValidationFunction<string>;
    lastName?: ValidationFunction<string>;
    contact?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type EmergencyCreateFormOverridesProps = {
    EmergencyCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    firstName?: PrimitiveOverrideProps<TextFieldProps>;
    lastName?: PrimitiveOverrideProps<TextFieldProps>;
    contact?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type EmergencyCreateFormProps = React.PropsWithChildren<{
    overrides?: EmergencyCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: EmergencyCreateFormInputValues) => EmergencyCreateFormInputValues;
    onSuccess?: (fields: EmergencyCreateFormInputValues) => void;
    onError?: (fields: EmergencyCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: EmergencyCreateFormInputValues) => EmergencyCreateFormInputValues;
    onValidate?: EmergencyCreateFormValidationValues;
} & React.CSSProperties>;
export default function EmergencyCreateForm(props: EmergencyCreateFormProps): React.ReactElement;
