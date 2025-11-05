import { FC } from 'react';
import { ButtonProps } from '@chakra-ui/react';
import { IconButton, RefreshIcon16 } from 'src/shared';

interface Props extends ButtonProps {
    onRefresh: () => void;
}

const RefreshInvoicesTableButton: FC<Props> = ({ onRefresh, ...props }) => {
    return (
        <IconButton
            onClick={onRefresh}
            icon={<RefreshIcon16 />}
            aria-label="refresh table"
            {...props}
        />
    );
};

export default RefreshInvoicesTableButton;
