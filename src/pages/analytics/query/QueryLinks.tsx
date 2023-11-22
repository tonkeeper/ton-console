import { ComponentProps, FunctionComponent, ReactNode } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { ButtonLink, ConsoleDocsIcon32 } from 'src/shared';
import { ANALYTICS_LINKS } from 'src/features';

const QueryLinkCard: FunctionComponent<{
    icon: ReactNode;
    heading: string;
    subHeading: string;
    href: string;
}> = props => {
    return (
        <ButtonLink
            variant="flat"
            isExternal
            href={props.href}
            display="flex"
            gap="10px"
            h="fit-content"
            py="2"
            pr="3"
            pl="0"
            _hover={{ transform: 'scale(1.02)' }}
            _active={{ transform: 'scale(0.99)' }}
            justifyContent="flex-start"
        >
            <Box alignSelf="flex-start">{props.icon}</Box>
            <Box>
                <Text textStyle="label2">{props.heading}</Text>
                <Text textStyle="body3" color="text.secondary" whiteSpace="initial">
                    {props.subHeading}
                </Text>
            </Box>
        </ButtonLink>
    );
};

export const QueryLinks: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Box {...props} w="240px">
            <Text textStyle="label2" mb="2" color="text.secondary">
                Data base structure
            </Text>
            <QueryLinkCard
                icon={<ConsoleDocsIcon32 />}
                heading="Console Docs"
                subHeading="The technical documentation and guides"
                href={ANALYTICS_LINKS.QUERY.DOCS}
            />
        </Box>
    );
};
