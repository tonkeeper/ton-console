import { ComponentProps, FunctionComponent } from 'react';
import { Button } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { IconButton, RefreshIcon16 } from 'src/shared';
import { invoicesTableStore } from 'src/features';

const RefreshInvoicesTableButton: FunctionComponent<ComponentProps<typeof Button>> = props => {
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
