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
export declare type StorageStatisticsCreateFormInputValues = {
    timestamp?: number;
    fileSize?: string;
    s3Key?: string;
};
export declare type StorageStatisticsCreateFormValidationValues = {
    timestamp?: ValidationFunction<number>;
    fileSize?: ValidationFunction<string>;
    s3Key?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type StorageStatisticsCreateFormOverridesProps = {
    StorageStatisticsCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    timestamp?: PrimitiveOverrideProps<TextFieldProps>;
    fileSize?: PrimitiveOverrideProps<TextFieldProps>;
    s3Key?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type StorageStatisticsCreateFormProps = React.PropsWithChildren<{
    overrides?: StorageStatisticsCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: StorageStatisticsCreateFormInputValues) => StorageStatisticsCreateFormInputValues;
    onSuccess?: (fields: StorageStatisticsCreateFormInputValues) => void;
    onError?: (fields: StorageStatisticsCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: StorageStatisticsCreateFormInputValues) => StorageStatisticsCreateFormInputValues;
    onValidate?: StorageStatisticsCreateFormValidationValues;
} & React.CSSProperties>;
export default function StorageStatisticsCreateForm(props: StorageStatisticsCreateFormProps): React.ReactElement;
