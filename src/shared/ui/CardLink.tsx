import { FC, PropsWithChildren, ReactNode, useId } from 'react';
import { Box, Card, CardBody, CardProps, Link, Text } from '@chakra-ui/react';
import { ArrowIcon, ConsoleDocsIcon32, EXTERNAL_LINKS } from 'src/shared';

export const CardLink: FC<PropsWithChildren<CardProps & { href?: string; icon?: ReactNode }>> = ({
    children,
    icon,
    ...rest
}) => {
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
                <Box alignSelf="center" mr="3">
                    {icon || <ConsoleDocsIcon32 />}
                </Box>

                <Box flex="1">
                    {children || (
                        <>
                            <Text textStyle="label1" textDecoration="none">
                                Ton Console Docs
                            </Text>

                            <Text textStyle="body2" color="text.secondary" textDecoration="none">
                                Software guides for Ton Apps products
                            </Text>
                        </>
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
