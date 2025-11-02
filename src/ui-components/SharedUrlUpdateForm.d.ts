/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { SharedUrl } from "../models";
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
export declare type SharedUrlUpdateFormInputValues = {
    url?: string;
    isReady?: boolean;
    timestamp?: number;
};
export declare type SharedUrlUpdateFormValidationValues = {
    url?: ValidationFunction<string>;
    isReady?: ValidationFunction<boolean>;
    timestamp?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SharedUrlUpdateFormOverridesProps = {
    SharedUrlUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    url?: PrimitiveOverrideProps<TextFieldProps>;
    isReady?: PrimitiveOverrideProps<SwitchFieldProps>;
    timestamp?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type SharedUrlUpdateFormProps = React.PropsWithChildren<{
    overrides?: SharedUrlUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    sharedUrl?: SharedUrl;
    onSubmit?: (fields: SharedUrlUpdateFormInputValues) => SharedUrlUpdateFormInputValues;
    onSuccess?: (fields: SharedUrlUpdateFormInputValues) => void;
    onError?: (fields: SharedUrlUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: SharedUrlUpdateFormInputValues) => SharedUrlUpdateFormInputValues;
    onValidate?: SharedUrlUpdateFormValidationValues;
} & React.CSSProperties>;
export default function SharedUrlUpdateForm(props: SharedUrlUpdateFormProps): React.ReactElement;
