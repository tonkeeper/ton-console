import { Flex, Link, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { CopyPad, H4, Span } from 'src/shared';

const SiteADNLAddress: FC<{ adnl: string }> = ({ adnl }) => {
    return (
        <Flex direction="column" w="100%" maxW={680} paddingY={5}>
            <H4 mb={3}>ADNL Address</H4>
            <CopyPad
                alignSelf="flex-start"
                mb="1"
                variant="flat"
                size="sm"
                text={adnl}
                iconAlign="start"
                pr="1"
            />
            <Text textStyle="body2" color="text.secondary">
                To connect, open{' '}
                <Link color="text.accent" href={'https://dns.tonkeeper.com/'} target="_blank">
                    dns.tonkeeper.com
                </Link>{' '}
                or{' '}
                <Link color="text.accent" href={'https://dns.ton.org/'} target="_blank">
                    dns.ton.org
                </Link>
                . On the domain page, click on <Span textStyle="label2">Edit domain</Span> and enter
                ADNL address data in the <Span textStyle="label2">TON sites</Span> field and save
                the changes.
            </Text>
        </Flex>
    );
};

export default observer(SiteADNLAddress);
