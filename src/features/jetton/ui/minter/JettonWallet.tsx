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
import { observer } from 'mobx-react-lite';
import { Address } from '@ton/core';
import { CopyPad, Span, isAddressValid } from 'src/shared';
import { fromDecimals, toDecimals } from '../../lib/utils';
import { jettonStore } from 'src/features';
import { JettonInfo } from '@ton-api/client';

const ModalChnageWallet: FC<{
    isOpen: boolean;
    onClose: (reset?: boolean) => void;
    onCheck: (address: Address) => void;
}> = ({ isOpen, onClose, onCheck }) => {
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
            if (jettonStore.connectedWalletAddress?.equals(address)) {
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
}> = ({ isOpen, onClose, onBurn, jettonSymbol, jettomDecimals }) => {
    const [value, setValue] = useState('');

    const handleClose = () => {
        setValue('');
        onClose();
    };

    const handleBurn = () => {
        onBurn(toDecimals(value, jettomDecimals));
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Burn {jettonSymbol}</ModalHeader>
                <ModalCloseButton />
                <ModalBody py="0">
                    <FormControl my={0}>
                        <Input
                            autoComplete="off"
                            autoFocus
                            min={0}
                            onChange={e => setValue(e.target.value)}
                            placeholder={`Enter ${jettonSymbol} amount`}
                            type="number"
                            value={value}
                        />
                        <FormHelperText color="text.secondary">
                            Number of tokens to burn from connected wallet
                        </FormHelperText>
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

const JettonWallet: FC<
    StyleProps & {
        connectedWalletAddress: Address | null;
        jettonInfo: JettonInfo;
    }
> = observer(({ connectedWalletAddress, jettonInfo, ...rest }) => {
    const [isModalChnageWalletOpen, setIsModalChnageWalletOpen] = useState(false);
    const [isModalBurnOpen, setIsModalBurnOpen] = useState(false);

    const walletUserAddress = jettonStore.showWalletAddress;
    const jettonWallet = jettonStore.jettonWallet$.value;
    const jettonMetadata = jettonInfo.metadata;

    const balance = jettonWallet
        ? fromDecimals(jettonWallet.balance, jettonMetadata.decimals)
        : '-';

    const isConnectedWallet = connectedWalletAddress
        ? walletUserAddress?.equals(connectedWalletAddress) ?? false
        : true;

    const isConnectedWalletOwner =
        (connectedWalletAddress && jettonInfo.admin?.address.equals(connectedWalletAddress)) ??
        false;

    const handleWalletChange = () => {
        if (isConnectedWallet) {
            setIsModalChnageWalletOpen(true);
        } else {
            jettonStore.setShowWalletAddress(connectedWalletAddress);
        }
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
                            {isConnectedWalletOwner && (
                                <Button
                                    textStyle="label2"
                                    color="text.accent"
                                    fontSize={14}
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
                onCheck={walletAddress => jettonStore.setShowWalletAddress(walletAddress)}
            />
            <ModalBurn
                isOpen={isModalBurnOpen}
                onClose={() => setIsModalBurnOpen(false)}
                onBurn={count => {
                    alert('Burn ' + count);
                    // jettonStore.burnJetton(count);
                }}
                jettonSymbol={jettonMetadata.symbol}
                jettomDecimals={jettonMetadata.decimals}
            />
        </>
    );
});

export default JettonWallet;
