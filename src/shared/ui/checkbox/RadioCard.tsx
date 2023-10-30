import { Box, Center, Fade, Flex, useRadio } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent } from 'react';
import { FilledTickIcon18, ejectRadioProps } from 'src/shared';

export const RadioCard: FunctionComponent<
    Parameters<typeof useRadio>[0] & ComponentProps<typeof Box>
> = props => {
    const { radioProps, rest } = ejectRadioProps<ComponentProps<typeof Box>>(props);
    const { getInputProps, getRadioProps } = useRadio(radioProps);

    const input = getInputProps();
    const checkbox = getRadioProps();

    return (
        <Box as="label" {...rest}>
            <input {...input} />
            <Flex
                {...checkbox}
                gap="2"
                pr="5"
                pl="3"
                py="3"
                border="1px"
                borderColor="separator.common"
                borderRadius="md"
                _checked={{
                    bg: 'background.contentTint'
                }}
                cursor="pointer"
                transition="background 0.1s linear"
            >
                <Center w="6" h="6">
                    <Center
                        w="18px"
                        h="18px"
                        bg="transparent"
                        border="1px"
                        borderColor="icon.secondary"
                        borderRadius="100%"
                        boxSizing="border-box"
                    >
                        <Box as={Fade} w="18px" h="18px" in={!!radioProps?.isChecked}>
                            <FilledTickIcon18 display="block" />
                        </Box>
                    </Center>
                </Center>
                {props.children}
            </Flex>
        </Box>
    );
};
