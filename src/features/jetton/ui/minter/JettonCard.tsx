import { FC, ReactNode } from 'react';
import { Text, Avatar, Flex, Box, StyleProps, Divider, Button } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { JettonInfo } from '@ton-api/client';
import { EditIcon24, IconButton, sliceAddress } from 'src/shared';
import { fromDecimals } from '../../lib/utils';

type JettonCardProps = StyleProps & {
    data: JettonInfo;
};

const Field: FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
    <Flex gap={2}>
        <Text w="88px" color="text.secondary">
            {label}
        </Text>
        {children}
    </Flex>
);

const JettonCard: FC<JettonCardProps> = observer(
    ({
        data: {
            metadata: { name, symbol, image, decimals, description, address },
            totalSupply,
            admin
        },
        ...rest
    }) => {
        return (
            <Box w={440} bgColor="background.contentTint" {...rest} borderRadius={8}>
                <Flex gap={3} p={4}>
                    <Avatar name={name} size="md" src={image} />
                    <Flex justify="center" direction="column">
                        <Flex gap={1}>
                            <Text textStyle="label1">{name}</Text>
                            <Text textStyle="body1" color="text.secondary">
                                {symbol}
                            </Text>
                        </Flex>
                        <Text
                            textStyle="body2"
                            overflow="hidden"
                            color="text.secondary"
                            textOverflow="ellipsis"
                            noOfLines={1}
                            title={description}
                        >
                            {description}
                        </Text>
                    </Flex>
                    <IconButton
                        aria-label="Remove"
                        icon={<EditIcon24 />}
                        onClick={() => alert('Test')}
                        ml="auto"
                    />
                </Flex>
                <Divider />
                <Box textStyle="body2" p={4}>
                    <Field label="Address">
                        <Text>{sliceAddress(address)}</Text>
                    </Field>
                    <Field label="Owner">
                        <Text>{admin ? sliceAddress(admin.address) : 'Owner missing'}</Text>
                        <Button
                            textStyle="body2"
                            color="text.accent"
                            fontWeight={400}
                            onClick={() => alert('Revoke')}
                            size="sm"
                            variant="link"
                        >
                            Revoke Ownership
                        </Button>
                    </Field>
                    <Field label="Symbol">
                        <Text>{symbol}</Text>
                    </Field>
                    <Field label="Decimals">
                        <Text>{decimals}</Text>
                    </Field>
                    <Field label="Total Supply">
                        <Text>
                            {fromDecimals(totalSupply, decimals)} {symbol}
                        </Text>
                        <Button
                            textStyle="body2"
                            color="text.accent"
                            fontWeight={400}
                            onClick={() => alert('Mint')}
                            size="sm"
                            variant="link"
                        >
                            Mint
                        </Button>
                    </Field>
                </Box>
            </Box>
        );
    }
);

export default JettonCard;
