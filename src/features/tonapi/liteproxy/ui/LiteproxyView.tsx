import { Text, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { CopyPad } from 'src/shared';
import { liteproxysStore } from '../model';
import { observer } from 'mobx-react-lite';

const LiteproxyView: FC = () => {
    const liteproxyList = liteproxysStore.liteproxyList$.value;

    return (
        <>
            {liteproxyList.map((liteproxy, index) => (
                <Flex key={liteproxy.server} direction="column" gap={1} mb={4}>
                    <Text textStyle="text.label1" fontWeight={600}>
                        {index === 0 ? 'Primary' : 'Backup'}
                    </Text>

                    <Flex align="baseline" gap={2}>
                        <Text textStyle="text.label2">Server:</Text>
                        <CopyPad text={liteproxy.server} variant="flat" width="190px" />
                    </Flex>
                    <Flex align="baseline" gap={2}>
                        <Text textStyle="text.label2">Public key:</Text>
                        <CopyPad text={liteproxy.public_key} variant="flat" width="400px" />
                    </Flex>
                </Flex>
            ))}
        </>
    );
};

export default observer(LiteproxyView);
