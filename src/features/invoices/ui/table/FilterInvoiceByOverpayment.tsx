import { FC } from 'react';
import { Checkbox, CheckboxProps } from '@chakra-ui/react';

interface Props extends CheckboxProps {
    isActive: boolean;
    onToggle: () => void;
}

const FilterInvoiceByOverpayment: FC<Props> = ({ isActive, onToggle, ...props }) => {
    return (
        <Checkbox
            h="fit-content"
            isChecked={isActive}
            onChange={onToggle}
            {...props}
        >
            Overpayment
        </Checkbox>
    );
};

export default FilterInvoiceByOverpayment;
