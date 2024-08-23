import { Button, Flex, useDisclosure, BoxProps, Spinner } from '@chakra-ui/react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { FC } from 'react';
import { EmptyPage } from 'src/entities';
import { CNFTAddModal, CNFTTable, CNFTStore } from 'src/features';
import { H4, Overlay } from 'src/shared';

const CnftPage: FC<BoxProps> = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const cnftStore = useLocalObservable(() => new CNFTStore());
    const isSitesEmpty = cnftStore.history$.value.length === 0;

    if (isSitesEmpty && cnftStore.history$.isLoading) {
        return (
            <Overlay display="flex" justifyContent="center" alignItems="center">
                <Spinner />
            </Overlay>
        );
    }

    if (cnftStore.history$.value.length === 0) {
        return (
            <>
                <EmptyPage
                    title="Compresed NFTs"
                    description={`The cNFT Indexing Service allows you to add and index your cNFTs via the Tonconsole interface.
                        
                        Making them available through TonAPI without requiring immediate on-chain minting.`}
                    mainButtonAction={onOpen}
                    mainButtonText="Add cNFT"
                    guideButtonLink="https://docs.tonconsole.com/tonconsole/nft#cnft-indexing-service"
                />
                <CNFTAddModal cnftStore={cnftStore} isOpen={isOpen} onClose={onClose} />
            </>
        );
    }

    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="flex-start" justify="space-between" mb="5">
                <H4>cNFT</H4>
                <Button onClick={onOpen} variant="secondary">
                    Add cNFT
                </Button>
            </Flex>
            <CNFTAddModal cnftStore={cnftStore} isOpen={isOpen} onClose={onClose} />
            <CNFTTable cnftStore={cnftStore} />
        </Overlay>
    );
};

export default observer(CnftPage);
