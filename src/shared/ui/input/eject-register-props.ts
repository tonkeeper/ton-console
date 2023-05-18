import { UseFormRegisterReturn } from 'react-hook-form';

export function ejectRegisterProps<T extends object>(
    props: UseFormRegisterReturn
): {
    register: Omit<UseFormRegisterReturn, 'ref'>;
    rest?: T;
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
        rest: rest as T
    };
}
