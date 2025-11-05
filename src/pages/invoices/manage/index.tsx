import { FC } from 'react';
import { Box, Button, Flex, useDisclosure } from '@chakra-ui/react';
import { H4, Overlay } from 'src/shared';
import {
    CreateInvoiceModal,
    FilterInvoiceByOverpayment,
    FilterInvoiceByPeriod,
    FilterInvoiceByStatus,
    FilterInvoiceByCurrency,
    InvoicesProjectInfo,
    InvoicesSearchInput,
    InvoicesTable,
    RefreshInvoicesTableButton
} from 'src/features';
import { useInvoicesApp, useInvoicesList, InvoiceForm, Invoice } from 'src/features/invoices/models';

const ManageInvoicesPage: FC = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const invoicesApp = useInvoicesApp();
    const invoicesList = useInvoicesList(invoicesApp.app?.id);

    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="center" justify="space-between" mb="5">
                <Box>
                    <Flex align="center" gap="2" mb="1">
                        <H4>Manage</H4>
                        <RefreshInvoicesTableButton onRefresh={invoicesList.refetch} />
                    </Flex>
                    <InvoicesProjectInfo invoicesApp={invoicesApp} />
                </Box>
                <Button h="44px" ml="auto" onClick={onOpen} variant="primary">
                    New Invoice
                </Button>
            </Flex>
            <Flex align="center" gap="4" mb="6">
                <InvoicesSearchInput
                    w="264px"
                    onSearch={invoicesList.setFilterById}
                />
                <FilterInvoiceByStatus
                    selectedStatuses={invoicesList.filter.status}
                    onToggle={invoicesList.toggleFilterByStatus}
                    onClear={invoicesList.clearFilterByStatus}
                />
                <FilterInvoiceByPeriod
                    period={invoicesList.filter.period}
                    onSetPeriod={invoicesList.setFilterByPeriod}
                    onClear={invoicesList.clearFilterByPeriod}
                />
                <FilterInvoiceByCurrency
                    selectedCurrencies={invoicesList.filter.currency}
                    onToggle={invoicesList.toggleFilterByCurrency}
                    onClear={invoicesList.clearFilterByCurrency}
                />
                <FilterInvoiceByOverpayment
                    isActive={invoicesList.filter.overpayment}
                    onToggle={invoicesList.toggleFilterByOverpayment}
                />
            </Flex>
            <InvoicesTable
                flex="1 1 auto"
                invoices={invoicesList.invoices}
                isLoading={invoicesList.isLoading}
                isEmpty={!invoicesList.invoices.length}
                currentSortColumn={invoicesList.sort.column}
                sortDirection={invoicesList.sort.direction}
                onSetSortColumn={invoicesList.setSortColumn}
                onToggleSortDirection={invoicesList.toggleSortDirection}
                onCancel={async (id: string) => {
                    await new Promise<void>((resolve) => {
                        invoicesList.cancelInvoice(id);
                        resolve();
                    });
                }}
                isCancelLoading={invoicesList.isCancelingInvoice}
            />
            <CreateInvoiceModal
                isOpen={isOpen}
                onClose={onClose}
                onCreateInvoice={async (form: InvoiceForm) => {
                    await Promise.resolve(invoicesList.createInvoice(form));
                    onClose();
                    return {
                        id: '',
                        amount: form.amount,
                        currency: form.currency,
                        validUntil: new Date(Date.now() + form.lifeTimeSeconds * 1000),
                        description: form.description,
                        creationDate: new Date(),
                        payTo: invoicesApp.app!.receiverAddress,
                        paymentLink: '',
                        status: 'pending'
                    } as unknown as Invoice;
                }}
                isLoading={invoicesList.isCreatingInvoice}
            />
        </Overlay>
    );
};

export default ManageInvoicesPage;
