import { ChangeEvent, useRef, useState, UIEvent, useLayoutEffect } from 'react';
import { Box, BoxProps, forwardRef, Textarea, TextareaProps } from '@chakra-ui/react';
import { mergeRefs } from 'src/shared';
import ResizeTextarea, { TextareaAutosizeProps } from 'react-textarea-autosize';

export const NumberedTextArea = forwardRef<
    TextareaProps & {
        wrapperProps?: BoxProps;
    } & TextareaAutosizeProps,
    typeof Textarea
>(({ onChange, onScroll, wrapperProps, minRows, ...rest }, ref) => {
    const [linesNumber, setLinesNumber] = useState(1);
    const internalTextareaRef = useRef<HTMLTextAreaElement | null>(null);
    const linesRef = useRef<HTMLDivElement | null>(null);
    const [{ pt, fontSize, lineHeight, fontWeight, fontFamily }, setStyle] = useState({
        pt: '0px',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        fontWeight: 'inherit',
        fontFamily: 'inherit'
    });

    useLayoutEffect(() => {
        setLinesNumber(minRows || 1);

        const textAreaStyles = internalTextareaRef.current
            ? getComputedStyle(internalTextareaRef.current)
            : null;
        if (textAreaStyles) {
            setStyle({
                pt: `${parseInt(textAreaStyles?.paddingTop || '0') + 1}px`,
                fontSize: textAreaStyles?.fontSize,
                lineHeight: textAreaStyles.lineHeight,
                fontWeight: textAreaStyles.fontWeight,
                fontFamily: textAreaStyles.fontFamily
            });
        }
    }, []);

    const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        let rows = e.target.value.split('\n').length;
        if (minRows && rows < minRows) {
            rows = minRows;
        }

        setLinesNumber(rows);
        onChange?.(e);
    };

    const onTextareaScroll = (e: UIEvent<HTMLTextAreaElement>): void => {
        if (internalTextareaRef.current && linesRef.current) {
            linesRef.current.style.top = -internalTextareaRef.current.scrollTop + 'px';
        }

        onScroll?.(e);
    };

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
                minRows={minRows}
                onChange={onTextAreaChange}
                onScroll={onTextareaScroll}
            />
        </Box>
    );
});
