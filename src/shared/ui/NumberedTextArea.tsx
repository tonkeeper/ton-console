import { ChangeEvent, ComponentProps, useRef, useState, UIEvent } from 'react';
import { Box, forwardRef, Textarea } from '@chakra-ui/react';
import { mergeRefs } from 'src/shared';
import ResizeTextarea from 'react-textarea-autosize';

export const NumberedTextArea = forwardRef<
    ComponentProps<typeof Textarea> & { wrapperProps?: ComponentProps<typeof Box> },
    typeof Textarea
>(({ onChange, onScroll, wrapperProps, ...rest }, ref) => {
    const [linesNumber, setLinesNumber] = useState(1);
    const internalTextareaRef = useRef<HTMLTextAreaElement | null>(null);
    const linesRef = useRef<HTMLDivElement | null>(null);

    const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        const lines = e.target.value.split('\n').length;
        setLinesNumber(lines);
        onChange?.(e);
    };

    const onTextareaScroll = (e: UIEvent<HTMLTextAreaElement>): void => {
        if (internalTextareaRef.current && linesRef.current) {
            linesRef.current.style.top = -internalTextareaRef.current.scrollTop + 'px';
        }

        onScroll?.(e);
    };

    const textAreaStyles = internalTextareaRef.current
        ? getComputedStyle(internalTextareaRef.current)
        : null;
    const pt = `${parseInt(textAreaStyles?.paddingTop || '0') + 1}px`;
    const fontSize = textAreaStyles?.fontSize || 'inherit';
    const lineHeight = textAreaStyles?.lineHeight || 'inherit';
    const fontWeight = textAreaStyles?.fontWeight || 'inherit';
    const fontFamily = textAreaStyles?.fontFamily || 'inherit';

    return (
        <Box {...wrapperProps} pos="relative" overflow="hidden">
            <Box
                ref={linesRef}
                as="pre"
                pos="absolute"
                zIndex="1"
                left="0"
                pt={pt}
                pl="4"
                color="text.secondary"
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                lineHeight={lineHeight}
                resize="none"
            >
                {Array.from({ length: linesNumber }, (_, i) => i + 1).join('\n')}
            </Box>
            <Textarea
                {...rest}
                ref={mergeRefs(ref, internalTextareaRef)}
                as={ResizeTextarea}
                overflow="hidden"
                minH="unset"
                maxH="100%"
                pl="44px"
                onChange={onTextAreaChange}
                onScroll={onTextareaScroll}
            />
        </Box>
    );
});
