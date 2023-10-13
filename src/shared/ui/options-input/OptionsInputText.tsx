import { ChangeEvent, ComponentProps, ReactElement, useContext, useRef, useState } from 'react';
import { Box, Fade, forwardRef, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { OptionsInputContext } from './context';
import { FilledTickIcon18 } from 'src/shared';

export const OptionsInputText = forwardRef<
    ComponentProps<typeof Input> & { rightElement?: ReactElement },
    typeof Input
>(({ rightElement, ...rest }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [rightElementWidth, setRightElementWidth] = useState('60px');
    const [value, setValue] = useState('');

    const { setInputValue, setInputType, inputType } = useContext(OptionsInputContext);

    const isTextSelected = inputType === 'text';

    const setInputIsText = (): void => {
        if (!isTextSelected) {
            setInputType?.('text');
        }
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setInputIsText();
        const actual = e.target.value;
        setValue(actual);
        setInputValue?.(actual);
    };

    const applyRightElementWidth = (el: HTMLDivElement | null): void => {
        if (el) {
            setRightElementWidth(getComputedStyle(el).width);
        }
    };

    return (
        <InputGroup>
            <Input
                ref={ref}
                pr={rightElementWidth}
                color={isTextSelected ? 'text.primary' : 'text.secondary'}
                autoComplete="off"
                onChange={handleChange}
                onFocus={setInputIsText}
                value={value}
                {...rest}
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
