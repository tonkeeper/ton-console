import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { ButtonLink, DownloadIcon16, H4, Overlay } from 'src/shared';
import {
    CreateInvoiceModal,
    FilterInvoiceByOverpayment,
    FilterInvoiceByPeriod,
    FilterInvoiceByStatus,
    FilterInvoiceByCurrency,
    InvoicesProjectInfo,
    InvoicesSearchInput,
    InvoicesTable,
    InvoicesAppStore,
    InvoicesTableStore,
    RefreshInvoicesTableButton
} from 'src/features';
import { Box, Button, Flex, useDisclosure } from '@chakra-ui/react';

interface ManageInvoicesPageProps {
    invoicesAppStore: InvoicesAppStore;
    invoicesTableStore: InvoicesTableStore;
}

const ManageInvoicesPage: FC<ManageInvoicesPageProps> = ({
    invoicesAppStore,
    invoicesTableStore
}) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="center" justify="space-between" mb="5">
                <Box>
                    <Flex align="center" gap="2" mb="1">
                        <H4>Manage</H4>
                        <RefreshInvoicesTableButton invoicesTableStore={invoicesTableStore} />
                    </Flex>
                    <InvoicesProjectInfo invoicesAppStore={invoicesAppStore} />
                </Box>
                <Button h="44px" ml="auto" onClick={onOpen} variant="primary">
                    New Invoice
                </Button>
            </Flex>
            <Flex align="center" gap="4" mb="6">
                <InvoicesSearchInput w="264px" invoicesTableStore={invoicesTableStore} />
                <FilterInvoiceByStatus invoicesTableStore={invoicesTableStore} />
                <FilterInvoiceByPeriod invoicesTableStore={invoicesTableStore} />
                <FilterInvoiceByCurrency invoicesTableStore={invoicesTableStore} />
                <FilterInvoiceByOverpayment invoicesTableStore={invoicesTableStore} />
                <ButtonLink
                    ml="auto"
                    leftIcon={<DownloadIcon16 />}
                    size="sm"
                    variant="flat"
                    href={invoicesTableStore.downloadInvoicesLink}
                    isExternal
                    download="invoices.csv"
                >
                    Download CSV
                </ButtonLink>
            </Flex>
            <InvoicesTable flex="1 1 auto" invoicesTableStore={invoicesTableStore} />
            <CreateInvoiceModal
                isOpen={isOpen}
                onClose={onClose}
                invoicesTableStore={invoicesTableStore}
            />
        </Overlay>
    );
};

export default observer(ManageInvoicesPage);
