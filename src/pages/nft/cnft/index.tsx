import { Button, Flex, useDisclosure, BoxProps, Spinner, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { EmptyPage } from 'src/entities';
import { CNFTAddModal, CNFTTable } from 'src/features';
import { EXTERNAL_LINKS, H4, Overlay } from 'src/shared';
import { useCNftHistory } from 'src/features/nft/model/queries';

const CnftPage: FC<BoxProps> = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { data: cnftHistory = [], isLoading } = useCNftHistory();
    const isSitesEmpty = cnftHistory.length === 0;

    if (isSitesEmpty && isLoading) {
        return (
            <Overlay display="flex" justifyContent="center" alignItems="center">
                <Spinner />
            </Overlay>
        );
    }

    if (cnftHistory.length === 0) {
        return (
            <>
                <EmptyPage
                    title="Compressed NFTs"
                    mainButtonAction={onOpen}
                    mainButtonText="Add cNFT"
                    guideButtonLink={EXTERNAL_LINKS.DOCUMENTATION_CNFT}
                >
                    <Text textStyle="body2">
                        The cNFT Indexing Service allows you to add and index your cNFTs via the
                        Tonconsole interface.
                    </Text>
                    <Text textStyle="body2" mt={4}>
                        Making them available through TonAPI without requiring immediate on-chain
                        minting.
                    </Text>
                </EmptyPage>
                <CNFTAddModal isOpen={isOpen} onClose={onClose} />
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
            <CNFTAddModal isOpen={isOpen} onClose={onClose} />
            <CNFTTable cnftHistory={cnftHistory} isLoading={isLoading} />
        </Overlay>
    );
};

export default CnftPage;
