import { TableContainer, Box, Text, Flex } from '@chakra-ui/react';
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
                    <Box key={liteproxy.server} mb={1}>
                        <Flex align="baseline" gap={2}>
                            <Text textStyle="text.label2">
                                {index === 0 ? 'Primary' : 'Backup'}:
                            </Text>
                            <CopyPad text={liteproxy.server} variant="flat" width="190px" />
                        </Flex>
                    </Box>
                ))}

            <Text textStyle="text.label1" mt={4} mb={2} fontSize={18} fontWeight={600}>
                Your public key
            </Text>
            <CopyPad text={`${liteproxyList[0].public_key}`} width="450px" mb={3} />
        </>
    );
};

export default observer(LiteproxyView);
