import { useRadio } from '@chakra-ui/react';

export function ejectRadioProps<T extends object>(
    props: Parameters<typeof useRadio>[0]
): { radioProps: Parameters<typeof useRadio>[0]; rest?: T } {
    if (!props) {
        return { radioProps: undefined };
    }

    const {
        id,
        name,
        value,
        isChecked,
        defaultChecked,
        isDisabled,
        isFocusable,
        isReadOnly,
        isInvalid,
        isRequired,
        onChange,
        'data-radiogroup': dataRadiogroup,
        'aria-describedby': ariaDescribedby,
        ...rest
    } = props;

    return {
        radioProps: {
            id,
            name,
            value,
            isChecked,
            defaultChecked,
            isDisabled,
            isFocusable,
            isReadOnly,
            isInvalid,
            isRequired,
            onChange,
            'data-radiogroup': dataRadiogroup,
            'aria-describedby': ariaDescribedby
        },
        rest: rest as T
    };
}
