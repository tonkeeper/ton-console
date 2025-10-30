import { FC } from 'react';
import { ButtonProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { IconButton, RefreshIcon16 } from 'src/shared';
import { InvoicesTableStore } from '../../models';

interface Props extends ButtonProps {
    invoicesTableStore: InvoicesTableStore;
}

const RefreshInvoicesTableButton: FC<Props> = ({ invoicesTableStore, ...props }) => {
    return (
        <IconButton
            onClick={() =>
                invoicesTableStore.loadFirstPageWithNewParams({ cancelPreviousCall: true })
            }
            icon={<RefreshIcon16 />}
            aria-label="refresh table"
            {...props}
        />
    );
};

export default observer(RefreshInvoicesTableButton);
