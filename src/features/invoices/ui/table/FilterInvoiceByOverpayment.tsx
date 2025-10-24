import { FC } from 'react';
import { Checkbox, CheckboxProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { invoicesTableStore } from 'src/features';

const FilterInvoiceByOverpayment: FC<CheckboxProps> = props => {
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
