import { ComponentProps, FunctionComponent, PropsWithChildren } from 'react';
import { Box, Card, CardBody, Link, Text } from '@chakra-ui/react';
import { ArrowIcon, ConsoleDocsIcon32 } from 'src/shared';

export const DocsLink: FunctionComponent<PropsWithChildren<ComponentProps<typeof Card>>> = ({
    children,
    ...rest
}) => {
    return (
        <Card
            as={Link}
            px="4"
            py="3"
            _hover={{ textDecoration: 'unset' }}
            variant="outline"
            {...rest}
        >
            <CardBody display="flex" pb="0" px="0">
                <ConsoleDocsIcon32 mr="3" alignSelf="center" />
                <Box flex="1">
                    <Text textStyle="label1" textDecoration="none">
                        Console Docs
                    </Text>
                    {children || (
                        <Text textStyle="body2" color="text.secondary" textDecoration="none">
                            Open platform with technical documentation of TON Apps products.
                        </Text>
                    )}
                </Box>
                <ArrowIcon ml="3" alignSelf="center" transform="rotate(-90deg)" />
            </CardBody>
        </Card>
    );
};
