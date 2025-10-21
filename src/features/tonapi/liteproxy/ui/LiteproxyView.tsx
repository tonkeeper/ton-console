import { Text, Flex, Button } from '@chakra-ui/react';
import { FC } from 'react';
import { CopyPad } from 'src/shared';
import { liteproxysStore } from 'src/shared/stores';
import { observer } from 'mobx-react-lite';
import DownloadConfigButton from './DownloadConfigButton';

interface LiteproxyViewProps {
    onStatisticsClick?: () => void;
}

const LiteproxyView: FC<LiteproxyViewProps> = ({ onStatisticsClick }) => {
    const liteproxyList = liteproxysStore.liteproxyList$.value;

    return (
        <>
            {liteproxyList.map((liteproxy, index) => (
                <Flex key={liteproxy.server} direction="column" gap={1} mb={4}>
                    <Text textStyle="text.label1" fontWeight={600}>
                        Server #{index + 1}
                    </Text>

                    <Flex align="baseline" gap={2}>
                        <Text textStyle="text.label2">Server:</Text>
                        <CopyPad text={liteproxy.server} variant="flat" width="190px" />
                    </Flex>
                    <Flex align="baseline" gap={2}>
                        <Text textStyle="text.label2">Public key:</Text>
                        <CopyPad text={liteproxy.public_key} variant="flat" width="407px" />
                    </Flex>
                </Flex>
            ))}
            <Flex gap={2} mt={4}>
                <DownloadConfigButton liteproxyList={liteproxyList} />
                {onStatisticsClick && (
                    <Button onClick={onStatisticsClick} variant="secondary">
                        Statistics
                    </Button>
                )}
            </Flex>
        </>
    );
};

export default observer(LiteproxyView);
