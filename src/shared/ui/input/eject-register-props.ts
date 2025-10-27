import { UseFormRegisterReturn } from 'react-hook-form';

type RegisterFieldProps = Pick<
    UseFormRegisterReturn,
    'onChange' | 'onBlur' | 'name' | 'min' | 'max' | 'maxLength' | 'minLength' | 'pattern' | 'required' | 'disabled'
>;

export function ejectRegisterProps<T extends Record<string, any>>(
    props: T
): {
    register: RegisterFieldProps;
    rest: Omit<T, keyof RegisterFieldProps>;
} {
    const {
        onChange,
        onBlur,
        name,
        min,
        max,
        maxLength,
        minLength,
        pattern,
        required,
        disabled,
        ...rest
    } = props;

    return {
        register: {
            onChange,
            onBlur,
            name,
            min,
            max,
            maxLength,
            minLength,
            pattern,
            required,
            disabled
        },
        rest: rest as Omit<T, keyof RegisterFieldProps>
    };
}
