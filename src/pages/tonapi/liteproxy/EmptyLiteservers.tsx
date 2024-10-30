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
            mainButtonText="Create Liteserver"
            guideButtonLink={EXTERNAL_LINKS.DOCUMENTATION_LITEPROXY}
        >
            <Text textStyle="body2">
                The LiteServers service allows you to create and gain direct access to LiteServers
                in the TON network.
            </Text>
            <Text textStyle="body2" mt={4}>
                Enjoy seamless access to TON blockchain data without the complexity and overhead of
                full synchronization on your infrastructure.
            </Text>
        </EmptyPage>
    );
};
