import { FC } from 'react';
import { RegisterApp } from './RegisterApp';
import { Center, Spinner } from '@chakra-ui/react';
import { AppMessagesDashboard } from './dashboard/AppMessagesDashboard';
import { useDappsQuery } from 'src/entities/dapp/model/queries';

const AppMessagesPage: FC = () => {
    const { data: dapps, isLoading } = useDappsQuery();

    if (isLoading) {
        return (
            <Center h="200px">
                <Spinner />
            </Center>
        );
    }

    if (dapps && dapps.length > 0) {
        return <AppMessagesDashboard />;
    }

    return <RegisterApp />;
};

export default AppMessagesPage;
