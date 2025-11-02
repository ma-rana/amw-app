/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { StorageStatistics } from "../models";
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
export declare type StorageStatisticsUpdateFormInputValues = {
    timestamp?: number;
    fileSize?: string;
    s3Key?: string;
};
export declare type StorageStatisticsUpdateFormValidationValues = {
    timestamp?: ValidationFunction<number>;
    fileSize?: ValidationFunction<string>;
    s3Key?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type StorageStatisticsUpdateFormOverridesProps = {
    StorageStatisticsUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    timestamp?: PrimitiveOverrideProps<TextFieldProps>;
    fileSize?: PrimitiveOverrideProps<TextFieldProps>;
    s3Key?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type StorageStatisticsUpdateFormProps = React.PropsWithChildren<{
    overrides?: StorageStatisticsUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    storageStatistics?: StorageStatistics;
    onSubmit?: (fields: StorageStatisticsUpdateFormInputValues) => StorageStatisticsUpdateFormInputValues;
    onSuccess?: (fields: StorageStatisticsUpdateFormInputValues) => void;
    onError?: (fields: StorageStatisticsUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: StorageStatisticsUpdateFormInputValues) => StorageStatisticsUpdateFormInputValues;
    onValidate?: StorageStatisticsUpdateFormValidationValues;
} & React.CSSProperties>;
export default function StorageStatisticsUpdateForm(props: StorageStatisticsUpdateFormProps): React.ReactElement;
