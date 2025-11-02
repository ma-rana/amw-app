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
export declare type NotificationCreateFormInputValues = {
    timestamp?: number;
    message?: string;
    title?: string;
    storyId?: string;
    StoryName?: string;
    inviteCode?: string;
    storyImageUrl?: string;
    isRead?: boolean;
    isStoryJoined?: boolean;
    redirectUrl?: string;
    momentId?: string;
};
export declare type NotificationCreateFormValidationValues = {
    timestamp?: ValidationFunction<number>;
    message?: ValidationFunction<string>;
    title?: ValidationFunction<string>;
    storyId?: ValidationFunction<string>;
    StoryName?: ValidationFunction<string>;
    inviteCode?: ValidationFunction<string>;
    storyImageUrl?: ValidationFunction<string>;
    isRead?: ValidationFunction<boolean>;
    isStoryJoined?: ValidationFunction<boolean>;
    redirectUrl?: ValidationFunction<string>;
    momentId?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type NotificationCreateFormOverridesProps = {
    NotificationCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    timestamp?: PrimitiveOverrideProps<TextFieldProps>;
    message?: PrimitiveOverrideProps<TextFieldProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    storyId?: PrimitiveOverrideProps<TextFieldProps>;
    StoryName?: PrimitiveOverrideProps<TextFieldProps>;
    inviteCode?: PrimitiveOverrideProps<TextFieldProps>;
    storyImageUrl?: PrimitiveOverrideProps<TextFieldProps>;
    isRead?: PrimitiveOverrideProps<SwitchFieldProps>;
    isStoryJoined?: PrimitiveOverrideProps<SwitchFieldProps>;
    redirectUrl?: PrimitiveOverrideProps<TextFieldProps>;
    momentId?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type NotificationCreateFormProps = React.PropsWithChildren<{
    overrides?: NotificationCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: NotificationCreateFormInputValues) => NotificationCreateFormInputValues;
    onSuccess?: (fields: NotificationCreateFormInputValues) => void;
    onError?: (fields: NotificationCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: NotificationCreateFormInputValues) => NotificationCreateFormInputValues;
    onValidate?: NotificationCreateFormValidationValues;
} & React.CSSProperties>;
export default function NotificationCreateForm(props: NotificationCreateFormProps): React.ReactElement;
