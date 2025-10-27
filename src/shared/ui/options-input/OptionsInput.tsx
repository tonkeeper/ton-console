import { forwardRef, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Box, useRadioGroup, chakra, BoxProps } from '@chakra-ui/react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { mergeRefs, OptionsInputOption, setNativeElementValue } from 'src/shared';
import { ejectRegisterProps } from '../input';
import { OptionsInputContext } from './context';

const unsetRadioValue = '#unset';

export const OptionsInput = forwardRef<
    HTMLInputElement,
    PropsWithChildren<BoxProps & UseFormRegisterReturn & { defaultValue?: string }>
>((props, ref) => {
    const { children, defaultValue } = props;
    const [inputType, setInputType] = useState<'radio' | 'text'>('radio');
    const [value, setValue] = useState(defaultValue);
    const elementRef = useRef<HTMLInputElement | null>(null);
    const setInputValue = (val: string | number): void => {
        if (elementRef.current) {
            setNativeElementValue(elementRef.current, val.toString());
            elementRef.current.dispatchEvent(
                new InputEvent('input', { data: val.toString(), bubbles: true })
            );
        }

        setValue(value);
    };


    const { register, rest } = ejectRegisterProps(props);

    const {
        getRootProps,
        getRadioProps,
        setValue: setRadioValue
    } = useRadioGroup({
        name: register.name,
        defaultValue,
        onChange: val => {
            if (val === unsetRadioValue) {
                return;
            }
            if (inputType !== 'radio') {
                setInputType('radio');
            }
            setInputValue(val);
        }
    });

    useEffect(() => {
        if (inputType !== 'radio') {
            setRadioValue('#unset');
        }
    }, [inputType]);

    const { ...group } = getRootProps();

    return (
        <OptionsInputContext.Provider
            value={{ getRadioProps, setInputValue, inputType, setInputType }}
        >
            <Box {...group} {...rest}>
                <chakra.input
                    defaultValue={defaultValue}
                    display="none"
                    ref={mergeRefs(elementRef, ref)}
                    type="number"
                    {...register}
                />
                <OptionsInputOption display="none" value={unsetRadioValue} />
                {children}
            </Box>
        </OptionsInputContext.Provider>
    );
});

OptionsInput.displayName = 'OptionsInput';
