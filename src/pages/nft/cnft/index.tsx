import { Button, Flex, useDisclosure, Text, BoxProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import CNFTAddModal from 'src/features/nft/ui/cnft/CNFTAddModal';
import { H3, H4, InvoiceIcon40, Overlay } from 'src/shared';

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
            <Overlay pt="60px" display="flex" flexDirection="column" alignItems="center">
                <InvoiceIcon40 mb="5" />
                <H3 mb="4">Track added cNFT</H3>
                <Text
                    textStyle="body2"
                    maxW="392px"
                    mb="9"
                    color="text.secondary"
                    textAlign="center"
                >
                    This feature is under development. Please check back later.
                </Text>
            </Overlay>
        </Overlay>
    );
};

export default observer(CnftPage);
