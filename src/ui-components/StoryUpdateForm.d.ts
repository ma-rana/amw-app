/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Story } from "../models";
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
export declare type StoryUpdateFormInputValues = {
    title?: string;
    inviteCode?: string;
    inviteCodeForOwner?: string;
    imageUrl?: string;
    userId?: string;
    userIds?: string[];
    locked?: boolean;
};
export declare type StoryUpdateFormValidationValues = {
    title?: ValidationFunction<string>;
    inviteCode?: ValidationFunction<string>;
    inviteCodeForOwner?: ValidationFunction<string>;
    imageUrl?: ValidationFunction<string>;
    userId?: ValidationFunction<string>;
    userIds?: ValidationFunction<string>;
    locked?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type StoryUpdateFormOverridesProps = {
    StoryUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    inviteCode?: PrimitiveOverrideProps<TextFieldProps>;
    inviteCodeForOwner?: PrimitiveOverrideProps<TextFieldProps>;
    imageUrl?: PrimitiveOverrideProps<TextFieldProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    userIds?: PrimitiveOverrideProps<TextFieldProps>;
    locked?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type StoryUpdateFormProps = React.PropsWithChildren<{
    overrides?: StoryUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    story?: Story;
    onSubmit?: (fields: StoryUpdateFormInputValues) => StoryUpdateFormInputValues;
    onSuccess?: (fields: StoryUpdateFormInputValues) => void;
    onError?: (fields: StoryUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: StoryUpdateFormInputValues) => StoryUpdateFormInputValues;
    onValidate?: StoryUpdateFormValidationValues;
} & React.CSSProperties>;
export default function StoryUpdateForm(props: StoryUpdateFormProps): React.ReactElement;
