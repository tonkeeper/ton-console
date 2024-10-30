import { FC } from 'react';
import { EXTERNAL_LINKS } from 'src/shared';
import { Text } from '@chakra-ui/react';
import { EmptyPage } from 'src/entities';

export const EmptyLiteservers: FC<{
    onOpenCreate: () => void;
}> = ({ onOpenCreate }) => {
    return (
        <EmptyPage
            title="Liteservers"
            mainButtonAction={onOpenCreate}
            mainButtonText="Add Liteserver"
            guideButtonLink={EXTERNAL_LINKS.DOCUMENTATION_LITEPROXY}
        >
            <Text textStyle="body2">
                The cNFT Indexing Service allows you to add and index your cNFTs via the Tonconsole
                interface.
            </Text>
            <Text textStyle="body2" mt={4}>
                Making them available through TonAPI without requiring immediate on-chain minting.
            </Text>
        </EmptyPage>
    );
};
