import { FC, PropsWithChildren, useContext } from 'react';
import { Box, BoxProps, Fade, Flex, useRadio } from '@chakra-ui/react';
import { FilledTickIcon18 } from 'src/shared';
import { OptionsInputContext } from './context';

export const OptionsInputOption: FC<
    PropsWithChildren<BoxProps & { value: string }>
> = ({ value, ...rest }) => {
    const { getRadioProps: getRadioGroupProps } = useContext(OptionsInputContext);
    const radioProps = getRadioGroupProps?.({ value });

    const { getInputProps, getRadioProps } = useRadio(radioProps);

    const input = getInputProps();
    const checkbox = getRadioProps();

    return (
        <Flex
            as="label"
            textStyle="body2"
            align="center"
            justify="space-between"
            gap="2"
            pr="3"
            pl="4"
            py="3"
            bg="field.background"
            border="none"
            borderRadius="md"
            cursor="pointer"
            {...rest}
            {...checkbox}
        >
            <input {...input} />
            {rest.children}
            <Box as={Fade} w="18px" h="18px" in={!!radioProps?.isChecked}>
                <FilledTickIcon18 display="block" />
            </Box>
        </Flex>
    );
};
