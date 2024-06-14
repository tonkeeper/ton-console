import { Box, Button, Flex, useDisclosure } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { ComponentProps, FunctionComponent, useEffect } from 'react';
import { analyticsHistoryTableStore } from 'src/features';
import CNFTAddModal from 'src/features/nft/ui/cnft/CNFTAddModal';
import { H4, Overlay } from 'src/shared';

const HistoryPage: FunctionComponent<ComponentProps<typeof Box>> = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    useEffect(() => {
        analyticsHistoryTableStore.loadFirstPage();
    }, []);

    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="flex-start" justify="space-between" mb="5">
                <H4>cNFT</H4>
                <Button onClick={onOpen} variant="secondary">
                    Add cNFT
                </Button>
            </Flex>
            <CNFTAddModal isOpen={isOpen} onClose={onClose} />
        </Overlay>
    );
};

export default observer(HistoryPage);
