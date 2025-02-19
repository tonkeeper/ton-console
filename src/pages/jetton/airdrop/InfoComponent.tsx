import { useState } from 'react';
import { Address, fromNano } from '@ton/core';
import { Card, Image, Flex, Text, Divider } from '@chakra-ui/react';
import { ADAirdropData } from 'src/shared/api/airdrop-api';
import { prettifyAmount, sliceString } from './deployUtils';
import { CopyIcon16, copyToClipboard, IconButton, TickIcon } from 'src/shared';

const TextItem = (props: { title: string; text: string; copyContent?: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        copyToClipboard(props.copyContent!);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <Flex direction="row" overflow="hidden" whiteSpace="nowrap">
            <Text textStyle="body2" minW="100px" color="text.secondary">
                {props.title}
            </Text>
            <Flex align="center" direction="row" gap="6px">
                <Text textStyle="body2" fontFamily={props.copyContent && 'mono'}>
                    {props.text}
                </Text>
                {!!props.copyContent && (
                    <IconButton
                        aria-label="copy"
                        icon={copied ? <TickIcon /> : <CopyIcon16 />}
                        onClick={handleCopy}
                    />
                )}
            </Flex>
        </Flex>
    );
};

export const InfoComponent = (props: { airdrop: ADAirdropData; id: string }) => {
    const {
        admin,
        jetton,
        royalty_parameters,
        file_name,
        file_hash,
        total_amount,
        recipients,
        shards
    } = props.airdrop;
    return (
        <Card bg="background.contentTint">
            <Flex align="center" direction="row" gap="12px" overflow="hidden" p="16px">
                <Image w="44px" h="44px" borderRadius="44px" src={jetton.preview} />
                <Flex direction="column">
                    <Flex direction="row" gap="4px">
                        <Text textStyle="label1">{jetton.symbol}</Text>
                        <Text textStyle="label1" color="text.secondary">
                            {jetton.name}
                        </Text>
                    </Flex>
                    <Flex>
                        <Text textStyle="body2" color="text.secondary">
                            {jetton.description}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
            <Divider />
            <Flex direction="column" gap="8px" px="16px">
                <Flex direction="column" gap="4px" py="8px">
                    <TextItem title="ID" text={props.id} copyContent={props.id} />
                </Flex>
                <Flex direction="column" gap="4px" py="8px">
                    <TextItem
                        title="Admin"
                        text={sliceString(Address.parse(admin).toString({ bounceable: false }), 16)}
                        copyContent={Address.parse(admin).toString({ bounceable: false })}
                    />
                    <TextItem
                        title="Jetton"
                        text={sliceString(
                            Address.parse(jetton.address).toString({ bounceable: true }),
                            16
                        )}
                        copyContent={Address.parse(jetton.address).toString({ bounceable: true })}
                    />
                    <TextItem
                        title="Claim Fee"
                        text={`${prettifyAmount(fromNano(royalty_parameters.min_commission))} TON`}
                    />
                </Flex>
                {!!file_name && !!file_hash && (
                    <Flex direction="column" gap="4px" py="8px">
                        <TextItem title="File name" text={file_name} />
                        <TextItem
                            title="File hash"
                            text={sliceString(file_hash)}
                            copyContent={file_hash}
                        />
                    </Flex>
                )}
                {!!total_amount && !!recipients && (
                    <Flex direction="column" gap="4px" py="8px">
                        <TextItem
                            title="Total Amount"
                            text={`${prettifyAmount(
                                parseFloat(total_amount) / 10 ** parseFloat(jetton.decimals)
                            )} ${jetton.symbol}`}
                        />
                        <TextItem title="Recepients" text={prettifyAmount(recipients)} />
                        {!!shards && <TextItem title="Contracts" text={prettifyAmount(shards)} />}
                    </Flex>
                )}
            </Flex>
        </Card>
    );
};
