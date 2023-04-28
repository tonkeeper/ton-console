import { useEffect, useState } from 'react';
import { ErrorOption, Path, useForm } from 'react-hook-form';

export type AsyncValidationState = 'idle' | 'validating' | 'succeed';

export function useAsyncValidator<N extends string, T extends string | number = string>(
    methods: Pick<
        ReturnType<typeof useForm<{ [key in N]: T }>>,
        'clearErrors' | 'setError' | 'formState' | 'getFieldState' | 'watch'
    >,
    fieldName: Path<{ [key in N]: T }>,
    validator: (val: T) => Promise<ErrorOption | undefined | null>,
    debounceTime?: number
): AsyncValidationState {
    const finalDebounceTime = debounceTime === undefined ? 500 : debounceTime;
    const [validationState, setValidationState] = useState<'idle' | 'validating' | 'succeed'>(
        'idle'
    );

    const { clearErrors, setError, formState, getFieldState, watch } = methods;
    const { error } = getFieldState(fieldName, formState);
    const value = watch(fieldName) as T;

    useEffect(() => {
        let shouldCancel = false;
        setValidationState('idle');
        const validate = async (): Promise<void> => {
            if (!error && value) {
                clearErrors(fieldName);

                await new Promise(r => setTimeout(r, finalDebounceTime));
                if (shouldCancel) {
                    return;
                }
                setValidationState('validating');
                const result = await validator(value);
                if (!shouldCancel) {
                    if (result) {
                        setError(fieldName, result);
                        setValidationState('idle');
                    } else {
                        setValidationState('succeed');
                    }
                }
            }
        };

        validate();

        return () => {
            shouldCancel = true;
        };
    }, [error, value, clearErrors, setError, validator]);

    return validationState;
}
