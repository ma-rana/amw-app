/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type SharedUrlCreateFormInputValues = {
    url?: string;
    isReady?: boolean;
    timestamp?: number;
};
export declare type SharedUrlCreateFormValidationValues = {
    url?: ValidationFunction<string>;
    isReady?: ValidationFunction<boolean>;
    timestamp?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SharedUrlCreateFormOverridesProps = {
    SharedUrlCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    url?: PrimitiveOverrideProps<TextFieldProps>;
    isReady?: PrimitiveOverrideProps<SwitchFieldProps>;
    timestamp?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type SharedUrlCreateFormProps = React.PropsWithChildren<{
    overrides?: SharedUrlCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: SharedUrlCreateFormInputValues) => SharedUrlCreateFormInputValues;
    onSuccess?: (fields: SharedUrlCreateFormInputValues) => void;
    onError?: (fields: SharedUrlCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: SharedUrlCreateFormInputValues) => SharedUrlCreateFormInputValues;
    onValidate?: SharedUrlCreateFormValidationValues;
} & React.CSSProperties>;
export default function SharedUrlCreateForm(props: SharedUrlCreateFormProps): React.ReactElement;
