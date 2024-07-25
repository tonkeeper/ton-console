import {
    Flex,
    BoxProps,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Divider,
    Box
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRightIcon16, H4, Overlay } from 'src/shared';

const SitesPage: FC<BoxProps> = () => {
    const { domain } = useParams<{ domain: string }>();

    return (
        <>
            <Breadcrumb
                mb="4"
                color="text.secondary"
                fontSize={14}
                fontWeight={700}
                separator={<ChevronRightIcon16 color="text.secondary" />}
                spacing="8px"
            >
                <BreadcrumbItem key={'/sites'}>
                    <BreadcrumbLink as={Link} to={'/sites'}>
                        All domains
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem color="text.primary" isCurrentPage>
                    <BreadcrumbLink href={'#'}>{domain}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Overlay display="flex" flexDirection="column">
                <Flex align="flex-start" justify="space-between" mb="5">
                    <H4>{domain}</H4>
                </Flex>
                <Divider />
                <Box paddingY={5}>TODO</Box>
            </Overlay>
        </>
    );
};

export default observer(SitesPage);
