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
export declare type StoryCreateFormInputValues = {
    title?: string;
    inviteCode?: string;
    inviteCodeForOwner?: string;
    imageUrl?: string;
    userId?: string;
    userIds?: string[];
    locked?: boolean;
};
export declare type StoryCreateFormValidationValues = {
    title?: ValidationFunction<string>;
    inviteCode?: ValidationFunction<string>;
    inviteCodeForOwner?: ValidationFunction<string>;
    imageUrl?: ValidationFunction<string>;
    userId?: ValidationFunction<string>;
    userIds?: ValidationFunction<string>;
    locked?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type StoryCreateFormOverridesProps = {
    StoryCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    inviteCode?: PrimitiveOverrideProps<TextFieldProps>;
    inviteCodeForOwner?: PrimitiveOverrideProps<TextFieldProps>;
    imageUrl?: PrimitiveOverrideProps<TextFieldProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    userIds?: PrimitiveOverrideProps<TextFieldProps>;
    locked?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type StoryCreateFormProps = React.PropsWithChildren<{
    overrides?: StoryCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: StoryCreateFormInputValues) => StoryCreateFormInputValues;
    onSuccess?: (fields: StoryCreateFormInputValues) => void;
    onError?: (fields: StoryCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: StoryCreateFormInputValues) => StoryCreateFormInputValues;
    onValidate?: StoryCreateFormValidationValues;
} & React.CSSProperties>;
export default function StoryCreateForm(props: StoryCreateFormProps): React.ReactElement;
