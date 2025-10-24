import { ComponentProps, FC } from 'react';
import { Checkbox } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { invoicesTableStore } from 'src/features';

const FilterInvoiceByOverpayment: FC<ComponentProps<typeof Checkbox>> = props => {
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
