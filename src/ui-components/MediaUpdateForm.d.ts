/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Media } from "../models";
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
export declare type MediaUpdateFormInputValues = {
    parentId?: string;
    timestamp?: number;
    imageUrl?: string;
    videoUrl?: string;
    mediaSizeMegaBytes?: number;
    isVideo?: boolean;
};
export declare type MediaUpdateFormValidationValues = {
    parentId?: ValidationFunction<string>;
    timestamp?: ValidationFunction<number>;
    imageUrl?: ValidationFunction<string>;
    videoUrl?: ValidationFunction<string>;
    mediaSizeMegaBytes?: ValidationFunction<number>;
    isVideo?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MediaUpdateFormOverridesProps = {
    MediaUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    parentId?: PrimitiveOverrideProps<TextFieldProps>;
    timestamp?: PrimitiveOverrideProps<TextFieldProps>;
    imageUrl?: PrimitiveOverrideProps<TextFieldProps>;
    videoUrl?: PrimitiveOverrideProps<TextFieldProps>;
    mediaSizeMegaBytes?: PrimitiveOverrideProps<TextFieldProps>;
    isVideo?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type MediaUpdateFormProps = React.PropsWithChildren<{
    overrides?: MediaUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    media?: Media;
    onSubmit?: (fields: MediaUpdateFormInputValues) => MediaUpdateFormInputValues;
    onSuccess?: (fields: MediaUpdateFormInputValues) => void;
    onError?: (fields: MediaUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MediaUpdateFormInputValues) => MediaUpdateFormInputValues;
    onValidate?: MediaUpdateFormValidationValues;
} & React.CSSProperties>;
export default function MediaUpdateForm(props: MediaUpdateFormProps): React.ReactElement;
