import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { AirdropSchemeIcon, H3, Overlay } from 'src/shared';
import { Card, Badge, Button, Flex, Text } from '@chakra-ui/react';

export const EmptyAirdrops: FunctionComponent = () => {
    return (
        <Overlay display="flex" alignItems="center" justifyContent="center">
            <Flex align="flex-start" direction="column" gap="32px" maxW="800px">
                <Flex align="flex-start" direction="column" gap="12px">
                    <H3>Airdrop</H3>
                    <Text textStyle="Body2" color="text.secondary">
                        Service enables a mass jetton distribution model where the recipient pays a
                        fixed fee in TONs and receives jettons. The distribution is carried out to a
                        fixed list of Recipients. In the following, we will refer to the jetton
                        distribution process as an Airdrop.
                    </Text>
                    <Card px="32px" py="22px" bg="background.contentTint">
                        <AirdropSchemeIcon />
                    </Card>
                    <Flex align="flex-start" direction="column" gap="4px">
                        <Text textStyle="Label2" color="text.secondary">
                            How it works
                        </Text>
                        <Text textStyle="Body2" color="text.secondary">
                            1. The Airdrop organizer (Airdrop admin) prepares an Airdrop file with a
                            fixed list of Recipients
                        </Text>
                        <Text textStyle="Body2" color="text.secondary">
                            2. The Airdrop admin creates a new project in Ton Console and fills in
                            the Airdrop data
                        </Text>
                        <Text textStyle="Body2" color="text.secondary">
                            3. The Airdrop admin connects their wallet via TON Connect (in Ton
                            Console) and deploys the Airdrop smart contracts
                        </Text>
                        <Text textStyle="Body2" color="text.secondary">
                            4. The Airdrop admin on their hosting raises a dApp that allows the
                            Recipient to connect their wallet and receive jettons by paying a fee
                        </Text>
                    </Flex>
                    <Badge
                        textStyle="label3"
                        color="accent.red"
                        bgColor={'color-mix(in srgb, currentColor 12%, transparent)'}
                    >
                        TESTNET The service is in the testing phase. Do not use for production
                        airdrops!
                    </Badge>
                </Flex>
                <Flex direction="row" gap="16px">
                    <Button as={Link} to={'/jetton/new-airdrop'}>
                        New Airdrop
                    </Button>
                    <Button
                        onClick={() => {
                            window.open(
                                'https://docs.tonconsole.com/tonconsole/jettons/airdrop',
                                '_blank'
                            );
                        }}
                        variant="secondary"
                    >
                        Documentation
                    </Button>
                </Flex>
            </Flex>
        </Overlay>
    );
};
