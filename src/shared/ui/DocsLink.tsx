import { ComponentProps, FunctionComponent, PropsWithChildren, useId } from 'react';
import { Box, Card, CardBody, Link, Text } from '@chakra-ui/react';
import { ArrowIcon, ConsoleDocsIcon32, EXTERNAL_LINKS } from 'src/shared';

export const DocsLink: FunctionComponent<
    PropsWithChildren<ComponentProps<typeof Card> & { href?: string }>
> = ({ children, ...rest }) => {
    const arrowId = useId();

    return (
        <Card
            as={Link}
            pr="5"
            pl="4"
            py="3"
            _hover={{
                textDecoration: 'unset',
                bg: 'background.contentTint',
                ['#' + CSS.escape(arrowId)]: { transform: 'rotate(-90deg) translateY(4px)' }
            }}
            transition="background 0.1s linear"
            href={EXTERNAL_LINKS.DOCUMENTATION}
            isExternal
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
                <ArrowIcon
                    transition="transform 0.1s linear"
                    id={arrowId}
                    ml="3"
                    alignSelf="center"
                    transform="rotate(-90deg)"
                />
            </CardBody>
        </Card>
    );
};
