import { UseFormRegisterReturn } from 'react-hook-form';

const REGISTER_KEYS = ['onChange', 'onBlur', 'name', 'min', 'max', 'maxLength', 'minLength', 'pattern', 'required', 'disabled'] as const;

type RegisterFieldProps = Pick<
    UseFormRegisterReturn,
    typeof REGISTER_KEYS[number]
>;

type RequiredRegisterProps = Pick<UseFormRegisterReturn, 'onChange' | 'onBlur' | 'name'>;

export function ejectRegisterProps<T extends RequiredRegisterProps & Record<string, unknown>>(
    props: T
): {
    register: RegisterFieldProps;
    rest: Omit<T, keyof RegisterFieldProps>;
} {
    const register: RegisterFieldProps = {
        onChange: props.onChange,
        onBlur: props.onBlur,
        name: props.name,
        min: props.min as UseFormRegisterReturn['min'],
        max: props.max as UseFormRegisterReturn['max'],
        maxLength: props.maxLength as UseFormRegisterReturn['maxLength'],
        minLength: props.minLength as UseFormRegisterReturn['minLength'],
        pattern: props.pattern as UseFormRegisterReturn['pattern'],
        required: props.required as UseFormRegisterReturn['required'],
        disabled: props.disabled as UseFormRegisterReturn['disabled']
    };

    const rest = Object.fromEntries(
        Object.entries(props).filter(([key]) => !REGISTER_KEYS.includes(key as typeof REGISTER_KEYS[number]))
    );

    return {
        register,
        rest: rest as Omit<T, keyof RegisterFieldProps>
    };
}
