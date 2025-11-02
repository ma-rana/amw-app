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
export declare type MediaCreateFormInputValues = {
    parentId?: string;
    timestamp?: number;
    imageUrl?: string;
    videoUrl?: string;
    mediaSizeMegaBytes?: number;
    isVideo?: boolean;
};
export declare type MediaCreateFormValidationValues = {
    parentId?: ValidationFunction<string>;
    timestamp?: ValidationFunction<number>;
    imageUrl?: ValidationFunction<string>;
    videoUrl?: ValidationFunction<string>;
    mediaSizeMegaBytes?: ValidationFunction<number>;
    isVideo?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MediaCreateFormOverridesProps = {
    MediaCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    parentId?: PrimitiveOverrideProps<TextFieldProps>;
    timestamp?: PrimitiveOverrideProps<TextFieldProps>;
    imageUrl?: PrimitiveOverrideProps<TextFieldProps>;
    videoUrl?: PrimitiveOverrideProps<TextFieldProps>;
    mediaSizeMegaBytes?: PrimitiveOverrideProps<TextFieldProps>;
    isVideo?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type MediaCreateFormProps = React.PropsWithChildren<{
    overrides?: MediaCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: MediaCreateFormInputValues) => MediaCreateFormInputValues;
    onSuccess?: (fields: MediaCreateFormInputValues) => void;
    onError?: (fields: MediaCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MediaCreateFormInputValues) => MediaCreateFormInputValues;
    onValidate?: MediaCreateFormValidationValues;
} & React.CSSProperties>;
export default function MediaCreateForm(props: MediaCreateFormProps): React.ReactElement;
