import { FC, useState } from 'react';
import {
    StyleProps,
    List,
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Button,
    FormErrorMessage,
    InputGroup,
    InputRightElement,
    Text
} from '@chakra-ui/react';
import { Address } from '@ton/core';
import { JettonInfo, JettonBalance } from '@ton-api/client';
import { CopyPad, Span, isAddressValid, toDecimals, fromDecimals } from 'src/shared';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useIMask } from 'react-imask';
import { useBurnJettonMutation } from '../../model/queries';

const ModalChnageWallet: FC<{
    isOpen: boolean;
    onClose: (reset?: boolean) => void;
    onCheck: (address: Address) => void;
    connectedWalletAddress: Address | null;
}> = ({ isOpen, onClose, onCheck, connectedWalletAddress }) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setError(null);
    };

    const handleClose = () => {
        setValue('');
        setError(null);
        onClose();
    };

    const handleSelect = () => {
        if (isAddressValid(value)) {
            const address = Address.parse(value);
            if (connectedWalletAddress?.equals(address)) {
                setError('This address is same as connected wallet');
            } else {
                onCheck(Address.parse(value));
                handleClose();
            }
        } else {
            setError('Invalid address');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Check balance for another address</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb="0">
                    <FormControl mb={0} isInvalid={error !== null}>
                        <FormLabel htmlFor="name">Enter address to check balance:</FormLabel>
                        <Input
                            autoComplete="off"
                            autoFocus
                            onChange={handleChange}
                            onKeyDown={e => e.key === 'Enter' && handleSelect()}
                            placeholder="Wallet Address"
                            value={value}
                        />
                        <FormErrorMessage>{error}</FormErrorMessage>
                    </FormControl>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={handleClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button flex={1} onClick={handleSelect} type="submit" variant="primary">
                        Check balance
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const ModalBurn: FC<{
    isOpen: boolean;
    onClose: (reset?: boolean) => void;
    onBurn: (count: bigint) => void;
    jettonSymbol: string;
    jettomDecimals: string;
    jettonBalance: bigint;
}> = ({ isOpen, onClose, onBurn, jettonSymbol, jettomDecimals, jettonBalance }) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        setValue('');
        setError(null);
        onClose();
    };

    const handleBurn = () => {
        const v = fromDecimals(value, jettomDecimals);
        if (v <= 0n) {
            setError('Amount should be greater than 0');
        } else if (v > jettonBalance) {
            setError('Insufficient balance');
        } else {
            onBurn(v);
            handleClose();
        }
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setError(null);
    };

    const { ref: maskRef } = useIMask({
        mask: Number,
        scale: Number(jettomDecimals),
        signed: false,
        radix: '.',
        mapToRadix: [',']
    });

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Burn {jettonSymbol}</ModalHeader>
                <ModalCloseButton />
                <ModalBody py="0">
                    <FormControl my={0} isInvalid={error !== null}>
                        <Input
                            ref={maskRef}
                            autoComplete="off"
                            autoFocus
                            onChange={handleValueChange}
                            onKeyDown={e => e.key === 'Enter' && handleBurn()}
                            placeholder={`Enter ${jettonSymbol} amount`}
                            type="number"
                            value={value}
                        />
                        <FormHelperText color="text.secondary">
                            Number of tokens to burn from connected wallet
                        </FormHelperText>
                        <FormErrorMessage>{error}</FormErrorMessage>
                    </FormControl>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={handleClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        disabled={!value}
                        onClick={handleBurn}
                        type="submit"
                        variant="primary"
                    >
                        Burn
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

type JettonWalletProps = StyleProps & {
    connectedWalletAddress: Address | null;
    jettonInfo: JettonInfo;
    jettonAddress: Address | null;
    jettonWallet: JettonBalance | null;
};

const JettonWallet: FC<JettonWalletProps> = ({
    connectedWalletAddress,
    jettonInfo,
    jettonAddress,
    jettonWallet,
    ...rest
}) => {
    const [tonconnect] = useTonConnectUI();
    const [isModalChnageWalletOpen, setIsModalChnageWalletOpen] = useState(false);
    const [isModalBurnOpen, setIsModalBurnOpen] = useState(false);
    const [walletUserAddress, setWalletUserAddress] = useState<Address | null>(connectedWalletAddress);

    const burnMutation = useBurnJettonMutation(jettonAddress);
    const jettonMetadata = jettonInfo.metadata;

    const balance = jettonWallet ? toDecimals(jettonWallet.balance, jettonMetadata.decimals) : '-';

    const isConnectedWallet = connectedWalletAddress
        ? walletUserAddress?.equals(connectedWalletAddress) ?? false
        : true;

    const showBurnButton = isConnectedWallet && jettonWallet?.balance !== 0n;

    const handleWalletChange = () => {
        if (isConnectedWallet) {
            setIsModalChnageWalletOpen(true);
        } else {
            setWalletUserAddress(connectedWalletAddress);
        }
    };

    const handleBurn = (count: bigint) => {
        if (!jettonAddress || !connectedWalletAddress || !jettonWallet) {
            return;
        }

        burnMutation.mutate({
            amount: count,
            connectedWalletAddress,
            tonConnection: tonconnect,
            jettonWallet
        });
    };

    return (
        <>
            <Text textStyle="label1" py={5}>
                Connected Jetton wallet
            </Text>
            <List maxW={516} {...rest}>
                <FormControl>
                    <FormLabel justifyContent="space-between" display="flex" htmlFor="name">
                        <Span>Wallet Address</Span>
                        <Button
                            textStyle="body2"
                            color="text.accent"
                            fontSize={14}
                            fontWeight={400}
                            onClick={handleWalletChange}
                            variant="link"
                        >
                            {isConnectedWallet ? 'Check balance for another wallet' : 'Cancel'}
                        </Button>
                    </FormLabel>
                    <CopyPad
                        flex="1"
                        wordBreak="break-all"
                        text={walletUserAddress?.toString({ bounceable: false }) ?? '-'}
                    />
                    <FormHelperText color="text.secondary">
                        Connected wallet public address, can be shared to receive jetton transfers
                    </FormHelperText>
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="name">Wallet Balance</FormLabel>
                    <InputGroup>
                        <Input pr={63} readOnly value={balance} />
                        <InputRightElement w={63}>
                            {showBurnButton && (
                                <Button
                                    textStyle="label2"
                                    color={burnMutation.isPending ? undefined : 'text.accent'}
                                    fontSize={14}
                                    isLoading={burnMutation.isPending}
                                    onClick={() => setIsModalBurnOpen(true)}
                                    variant="link"
                                >
                                    Burn
                                </Button>
                            )}
                        </InputRightElement>
                    </InputGroup>
                    <FormHelperText color="text.secondary">
                        Number of tokens in connected wallet that can be transferred to others
                    </FormHelperText>
                </FormControl>
            </List>
            <ModalChnageWallet
                isOpen={isModalChnageWalletOpen}
                onClose={() => setIsModalChnageWalletOpen(false)}
                onCheck={walletAddress => setWalletUserAddress(walletAddress)}
                connectedWalletAddress={connectedWalletAddress}
            />
            {jettonWallet && (
                <ModalBurn
                    isOpen={isModalBurnOpen}
                    onClose={() => setIsModalBurnOpen(false)}
                    onBurn={handleBurn}
                    jettonBalance={BigInt(jettonWallet.balance)}
                    jettonSymbol={jettonMetadata.symbol}
                    jettomDecimals={jettonMetadata.decimals}
                />
            )}
        </>
    );
};

export default JettonWallet;
