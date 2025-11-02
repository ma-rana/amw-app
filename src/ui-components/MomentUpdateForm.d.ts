/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Moment } from "../models";
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
export declare type MomentUpdateFormInputValues = {
    title?: string;
    order?: number;
    mediaId?: string;
    description?: string;
    userId?: string;
    taggedUserIds?: string[];
    timestamp?: number;
    storyId?: string;
    reportedCount?: string;
};
export declare type MomentUpdateFormValidationValues = {
    title?: ValidationFunction<string>;
    order?: ValidationFunction<number>;
    mediaId?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    userId?: ValidationFunction<string>;
    taggedUserIds?: ValidationFunction<string>;
    timestamp?: ValidationFunction<number>;
    storyId?: ValidationFunction<string>;
    reportedCount?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MomentUpdateFormOverridesProps = {
    MomentUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    order?: PrimitiveOverrideProps<TextFieldProps>;
    mediaId?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    taggedUserIds?: PrimitiveOverrideProps<TextFieldProps>;
    timestamp?: PrimitiveOverrideProps<TextFieldProps>;
    storyId?: PrimitiveOverrideProps<TextFieldProps>;
    reportedCount?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type MomentUpdateFormProps = React.PropsWithChildren<{
    overrides?: MomentUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    moment?: Moment;
    onSubmit?: (fields: MomentUpdateFormInputValues) => MomentUpdateFormInputValues;
    onSuccess?: (fields: MomentUpdateFormInputValues) => void;
    onError?: (fields: MomentUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MomentUpdateFormInputValues) => MomentUpdateFormInputValues;
    onValidate?: MomentUpdateFormValidationValues;
} & React.CSSProperties>;
export default function MomentUpdateForm(props: MomentUpdateFormProps): React.ReactElement;
