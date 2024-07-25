import {
    Flex,
    BoxProps,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Divider
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyPage } from 'src/entities';
import { SiteADNLAddress, SiteEndpoints } from 'src/features';
import { sitesStore } from 'src/features';
import { ChevronRightIcon16, H4, Overlay } from 'src/shared';

const Breadcrumbs: FC<{ domain: string }> = ({ domain }) => (
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
);

const SitesPage: FC<BoxProps> = () => {
    const { domain } = useParams<{ domain: string }>();

    if (!domain) {
        throw new Error('Domain not provided');
    }

    const site = sitesStore.getSiteByDomain(domain);

    if (!site) {
        return (
            <>
                <Breadcrumbs domain={domain} />
                <EmptyPage
                    title={'Domain not found'}
                    description={`The domain “${domain}” has not been added yet.`}
                />
            </>
        );
    }

    return (
        <>
            <Breadcrumbs domain={domain} />
            <Overlay display="flex" flexDirection="column">
                <Flex align="flex-start" justify="space-between" mb="5">
                    <H4>{domain}</H4>
                </Flex>
                <Divider />
                <SiteADNLAddress adnl={site.adnl_address} />
                <Divider />
                <SiteEndpoints />
            </Overlay>
        </>
    );
};

export default observer(SitesPage);
