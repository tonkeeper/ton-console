import { TableContainer, Text, Flex } from '@chakra-ui/react';
import { ComponentProps, FC } from 'react';
import { CopyPad } from 'src/shared';
import { liteproxysStore } from '../model';
import { observer } from 'mobx-react-lite';

const LiteproxyView: FC<ComponentProps<typeof TableContainer>> = () => {
    const liteproxyList = liteproxysStore.liteproxyList$.value;

    return (
        <>
            <Text textStyle="text.label1" mb={2} fontSize={18} fontWeight={600}>
                Servers
            </Text>
            {liteproxyList.length > 0 &&
                liteproxyList.map((liteproxy, index) => (
                    <Flex key={liteproxy.server} direction="column" gap={1} mb={4}>
                        <Flex align="baseline" gap={2}>
                            <Text textStyle="text.label2">
                                {index === 0 ? 'Primary' : 'Backup'}:
                            </Text>
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
