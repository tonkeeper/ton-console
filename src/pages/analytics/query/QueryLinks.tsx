import { ComponentProps, FunctionComponent, ReactNode } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { ButtonLink, CubeIcon36, ShurikenIcon36, TableIcon36 } from 'src/shared';
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
            {props.icon}
            <Box>
                <Text textStyle="label2">{props.heading}</Text>
                <Text textStyle="body3">{props.subHeading}</Text>
            </Box>
        </ButtonLink>
    );
};

export const QueryLinks: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Box {...props} minW="240px">
            <Text textStyle="label2" mb="2" color="text.secondary">
                Data base structure
            </Text>
            <QueryLinkCard
                icon={<TableIcon36 />}
                heading="Tables"
                subHeading="Most popular datasets"
                href={ANALYTICS_LINKS.DATABASE_STRUCTURE.TABLES}
            />
            <QueryLinkCard
                icon={<CubeIcon36 />}
                heading="Raw"
                subHeading="Raw blockchain data"
                href={ANALYTICS_LINKS.DATABASE_STRUCTURE.RAW}
            />
            <QueryLinkCard
                icon={<ShurikenIcon36 />}
                heading="Examples"
                subHeading="List of sql examples"
                href={ANALYTICS_LINKS.DATABASE_STRUCTURE.EXAMPLES}
            />
        </Box>
    );
};
