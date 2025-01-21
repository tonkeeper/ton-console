import { Card, Image, Flex, Text, Divider } from '@chakra-ui/react';
import { ADAirdropData } from 'src/shared/api/airdrop-api';
import { Address, fromNano } from '@ton/core';

export const prettifyAmount = (v: number | string) => {
    const value = parseFloat(`${v}`);
    return new Intl.NumberFormat('en', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value);
};

export const sliceString = (str: string, length = 8) => {
    if (str.length / 2 < length) {
        return str;
    }

    const first = str.slice(0, length);
    const second = str.substring(str.length - length);

    return `${first}…${second}`;
};

const TextItem = (props: { title: string; text: string }) => {
    return (
        <Flex direction="row" overflow="hidden" whiteSpace="nowrap">
            <Text textStyle="body2" w="100px" color="text.secondary">
                {props.title}
            </Text>
            <Text textStyle="body2">{props.text}</Text>
        </Flex>
    );
};

export const InfoComponent = (props: { airdrop: ADAirdropData }) => {
    const { admin, jetton, royalty_parameters, file_name, file_hash, total_amount, recipients } =
        props.airdrop;
    return (
        <Card w="550px" bg="background.contentTint">
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
                    <TextItem
                        title="Admin"
                        text={Address.parse(admin).toString({ bounceable: false })}
                    />
                    <TextItem
                        title="Jetton"
                        text={Address.parse(jetton.address).toString({ bounceable: true })}
                    />
                    <TextItem
                        title="Claim Fee"
                        text={`${prettifyAmount(fromNano(royalty_parameters.min_commission))} TON`}
                    />
                </Flex>
                {!!file_name && !!file_hash && (
                    <Flex direction="column" gap="4px" py="8px">
                        <TextItem title="File name" text={file_name} />
                        <TextItem title="File hash" text={sliceString(file_hash)} />
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
                    </Flex>
                )}
            </Flex>
        </Card>
    );
};
