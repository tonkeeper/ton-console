import { FC } from 'react';
import { RegisterApp } from './RegisterApp';
import { observer } from 'mobx-react-lite';
import { dappStore } from 'src/shared/stores';
import { Center, Spinner } from '@chakra-ui/react';
import { AppMessagesDashboard } from './dashboard/AppMessagesDashboard';

const AppMessagesPage: FC = () => {
    if (!dappStore.dapps$.isResolved) {
        return (
            <Center h="200px">
                <Spinner />
            </Center>
        );
    }

    if (dappStore.dapps$.value.length) {
        return <AppMessagesDashboard />;
    }

    return <RegisterApp />;
};

export default observer(AppMessagesPage);
