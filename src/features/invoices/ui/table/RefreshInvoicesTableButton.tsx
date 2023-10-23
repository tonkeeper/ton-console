import { ComponentProps, FunctionComponent } from 'react';
import { Button } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { RefreshIcon16 } from 'src/shared';
import { invoicesTableStore } from 'src/features';

const RefreshInvoicesTableButton: FunctionComponent<ComponentProps<typeof Button>> = props => {
    return (
        <Button
            textStyle="body2"
            color="text.secondary"
            onClick={() =>
                invoicesTableStore.loadFirstPageWithNewParams({ cancelPreviousCall: true })
            }
            variant="flat"
            {...props}
        >
            <RefreshIcon16 mr="2" />
            Update
        </Button>
    );
};

export default observer(RefreshInvoicesTableButton);
