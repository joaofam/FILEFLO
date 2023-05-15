/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type FileCreateFormInputValues = {
    name?: string;
    description?: string;
    fileName?: string;
    createdAt?: string;
    updatedAt?: string;
    hashValue?: string;
    encyptedValue?: string;
    owners?: string[];
    folder?: string[];
};
export declare type FileCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    fileName?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
    hashValue?: ValidationFunction<string>;
    encyptedValue?: ValidationFunction<string>;
    owners?: ValidationFunction<string>;
    folder?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FileCreateFormOverridesProps = {
    FileCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    fileName?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
    hashValue?: PrimitiveOverrideProps<TextFieldProps>;
    encyptedValue?: PrimitiveOverrideProps<TextFieldProps>;
    owners?: PrimitiveOverrideProps<TextFieldProps>;
    folder?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type FileCreateFormProps = React.PropsWithChildren<{
    overrides?: FileCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: FileCreateFormInputValues) => FileCreateFormInputValues;
    onSuccess?: (fields: FileCreateFormInputValues) => void;
    onError?: (fields: FileCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FileCreateFormInputValues) => FileCreateFormInputValues;
    onValidate?: FileCreateFormValidationValues;
} & React.CSSProperties>;
export default function FileCreateForm(props: FileCreateFormProps): React.ReactElement;
