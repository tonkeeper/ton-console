import { FC } from 'react';
import { Checkbox, CheckboxProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { InvoicesTableStore } from '../../models';

interface Props extends CheckboxProps {
    invoicesTableStore: InvoicesTableStore;
}

const FilterInvoiceByOverpayment: FC<Props> = ({ invoicesTableStore, ...props }) => {
    return (
        <Checkbox
            h="fit-content"
            checked={invoicesTableStore.pagination.filter.overpayment}
            defaultChecked={invoicesTableStore.pagination.filter.overpayment}
            onChange={() => invoicesTableStore.toggleFilterByOverpayment()}
            {...props}
        >
            Overpayment
        </Checkbox>
    );
};

export default observer(FilterInvoiceByOverpayment);
