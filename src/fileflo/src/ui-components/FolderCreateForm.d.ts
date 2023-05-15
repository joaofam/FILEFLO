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
export declare type FolderCreateFormInputValues = {
    name?: string;
    description?: string;
    files?: string;
    encyptedValue?: string;
    owners?: string[];
    folder?: string[];
};
export declare type FolderCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    files?: ValidationFunction<string>;
    encyptedValue?: ValidationFunction<string>;
    owners?: ValidationFunction<string>;
    folder?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FolderCreateFormOverridesProps = {
    FolderCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    files?: PrimitiveOverrideProps<TextFieldProps>;
    encyptedValue?: PrimitiveOverrideProps<TextFieldProps>;
    owners?: PrimitiveOverrideProps<TextFieldProps>;
    folder?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type FolderCreateFormProps = React.PropsWithChildren<{
    overrides?: FolderCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: FolderCreateFormInputValues) => FolderCreateFormInputValues;
    onSuccess?: (fields: FolderCreateFormInputValues) => void;
    onError?: (fields: FolderCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FolderCreateFormInputValues) => FolderCreateFormInputValues;
    onValidate?: FolderCreateFormValidationValues;
} & React.CSSProperties>;
export default function FolderCreateForm(props: FolderCreateFormProps): React.ReactElement;
