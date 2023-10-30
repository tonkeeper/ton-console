import { ComponentProps, ReactElement, useContext, useRef, useState } from 'react';
import { Box, Fade, forwardRef, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { OptionsInputContext } from './context';
import { FilledTickIcon18, mergeRefs } from 'src/shared';
import { useIMask } from 'react-imask';
import { useForm } from 'react-hook-form';

export const OptionsInputText = forwardRef<
    ComponentProps<typeof Input> & {
        rightElement?: ReactElement;
        mask?: Parameters<typeof useIMask>[0];
    },
    typeof Input
>(({ rightElement, mask, ...rest }, ref) => {
    const { register, watch } = useForm();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [rightElementWidth, setRightElementWidth] = useState('60px');

    const { setInputValue, setInputType, inputType } = useContext(OptionsInputContext);

    const isTextSelected = inputType === 'text';
    const inputValue = watch('input');

    const setInputIsText = (): void => {
        if (!isTextSelected) {
            setInputType?.('text');
        }
    };

    const onFocus = (): void => {
        setInputIsText();
        setInputValue?.(inputValue);
    };

    const { ref: maskRef, value } = useIMask(
        mask || {
            mask: /^.*$/
        }
    );

    const applyRightElementWidth = (el: HTMLDivElement | null): void => {
        if (el) {
            setRightElementWidth(getComputedStyle(el).width);
        }
    };

    const { ref: hookFormRef, ...hookformRest } = register('input', {
        onChange: e => {
            const v = e.target.value;
            if (v !== undefined && isTextSelected) {
                setInputIsText();
                setInputValue?.(v);
            }
        }
    });

    return (
        <InputGroup>
            <Input
                ref={mergeRefs(ref, inputRef, maskRef, hookFormRef)}
                pr={rightElementWidth}
                color={isTextSelected ? 'text.primary' : 'text.secondary'}
                autoComplete="off"
                onFocus={onFocus}
                {...rest}
                {...hookformRest}
            />
            <InputRightElement
                ref={applyRightElementWidth}
                gap="2"
                display="flex"
                w="fit-content"
                px="3"
                cursor="text"
                onClick={() => inputRef.current?.focus()}
            >
                {!!value && rightElement}
                <Box as={Fade} w="18px" h="18px" in={isTextSelected}>
                    <FilledTickIcon18 display="block" />
                </Box>
            </InputRightElement>
        </InputGroup>
    );
});
