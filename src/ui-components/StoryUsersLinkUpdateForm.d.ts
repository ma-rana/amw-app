/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { StoryUsersLink } from "../models";
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
export declare type StoryUsersLinkUpdateFormInputValues = {
    userId?: string;
    storyId?: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
};
export declare type StoryUsersLinkUpdateFormValidationValues = {
    userId?: ValidationFunction<string>;
    storyId?: ValidationFunction<string>;
    role?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type StoryUsersLinkUpdateFormOverridesProps = {
    StoryUsersLinkUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    storyId?: PrimitiveOverrideProps<TextFieldProps>;
    role?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type StoryUsersLinkUpdateFormProps = React.PropsWithChildren<{
    overrides?: StoryUsersLinkUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    storyUsersLink?: StoryUsersLink;
    onSubmit?: (fields: StoryUsersLinkUpdateFormInputValues) => StoryUsersLinkUpdateFormInputValues;
    onSuccess?: (fields: StoryUsersLinkUpdateFormInputValues) => void;
    onError?: (fields: StoryUsersLinkUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: StoryUsersLinkUpdateFormInputValues) => StoryUsersLinkUpdateFormInputValues;
    onValidate?: StoryUsersLinkUpdateFormValidationValues;
} & React.CSSProperties>;
export default function StoryUsersLinkUpdateForm(props: StoryUsersLinkUpdateFormProps): React.ReactElement;
