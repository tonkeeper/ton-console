import { FC } from 'react';
import { EmptyLiteproxy } from './EmptyLiteproxy';
import { observer } from 'mobx-react-lite';
import { Overlay } from 'src/shared';
import { Button, Center, Spinner, useDisclosure } from '@chakra-ui/react';
import LiteproxyTable from 'src/features/tonapi/liteproxy/ui/LiteproxyTable';
import { CreateLiteproxyModal, liteproxysStore } from 'src/features/tonapi/liteproxy';

const LiteproxyPage: FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!liteproxysStore.liteproxyList$.isResolved) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    // if (!liteproxysStore.selectedTier$.value) {
    //     return <SelectPlanFirstly />;
    // }

    if (!liteproxysStore.liteproxyList$.value.length) {
        return <EmptyLiteproxy />;
    }

    return (
        <>
            <Overlay h="fit-content">
                <Button mb="6" onClick={onOpen} variant="secondary">
                    Create Liteproxy
                </Button>
                <LiteproxyTable />
            </Overlay>
            <CreateLiteproxyModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default observer(LiteproxyPage);
