import { Button, Flex, useDisclosure, BoxProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import CNFTAddModal from 'src/features/nft/ui/cnft/CNFTAddModal';
import CNFTTable from 'src/features/nft/ui/cnft/CNFTTable';
import { H4, Overlay } from 'src/shared';

const CnftPage: FC<BoxProps> = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="flex-start" justify="space-between" mb="5">
                <H4>cNFT</H4>
                <Button onClick={onOpen} variant="secondary">
                    Add cNFT
                </Button>
            </Flex>
            <CNFTAddModal isOpen={isOpen} onClose={onClose} />
            <CNFTTable />
        </Overlay>
    );
};

export default observer(CnftPage);
