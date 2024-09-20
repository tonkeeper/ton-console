import { FC, useEffect, useState } from 'react';
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
import { useTonAddress } from '@tonconnect/ui-react';
import { CopyPad, Span, isAddressValid } from 'src/shared';
import { fromDecimals, toDecimals } from '../../lib/utils';
import { JettonMetadata } from '@ton-api/client';
import { type JettonWallet as JettonWalletType } from '../../lib/deploy-controller';

const ModalChnageWallet: FC<{
    isOpen: boolean;
    onClose: (reset?: boolean) => void;
    onCheck: (address: Address) => void;
}> = ({ isOpen, onClose, onCheck }) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setError(false);
    };

    const handleSelect = () => {
        if (isAddressValid(value)) {
            onCheck(Address.parse(value));
            onClose();
        } else {
            setError(true);
        }
        setValue('');
    };

    return (
        <Modal isOpen={isOpen} onClose={() => onClose()} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Check balance for another address</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb="0">
                    <FormControl mb={0} isInvalid={error}>
                        <FormLabel htmlFor="name">Enter address to check balance:</FormLabel>
                        <Input
                            autoComplete="off"
                            autoFocus
                            onChange={handleChange}
                            placeholder="Wallet Address"
                            value={value}
                        />
                        <FormErrorMessage>{error && 'Invalid address'}</FormErrorMessage>
                    </FormControl>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={() => onClose()} variant="secondary">
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
    const [value, setValue] = useState(NaN);

    const handleClose = () => {
        setValue(NaN);
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
                            onChange={e => setValue(Number(e.target.value))}
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
                        onClick={() => onBurn(toDecimals(value, jettomDecimals))}
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
    onChangeWallet: (address: Address) => void;
    onBurn?: (count: bigint) => void;
    jettonMetadata: JettonMetadata;
    jettonWallet: JettonWalletType | null;
};

const JettonWallet: FC<JettonWalletProps> = observer(
    ({ onChangeWallet, onBurn, jettonWallet, jettonMetadata, ...rest }) => {
        const tonconnectAddressStr = useTonAddress();
        const tonconnectAddress = isAddressValid(tonconnectAddressStr)
            ? Address.parse(tonconnectAddressStr)
            : null;

        const [walletAddress, setWalletAddress] = useState<Address | null>(tonconnectAddress);

        const [isModalChnageWalletOpen, setIsModalChnageWalletOpen] = useState(false);
        const [isModalBurnOpen, setIsModalBurnOpen] = useState(false);

        useEffect(() => {
            if (walletAddress) {
                onChangeWallet(walletAddress);
            }
        }, [walletAddress, onChangeWallet]);

        if (!jettonWallet) {
            return null;
        }

        const balance = jettonWallet
            ? fromDecimals(jettonWallet.balance, jettonMetadata.decimals)
            : '-';

        return (
            <>
                <Text textStyle="label1" py={5}>
                    Connected Jetton wallet
                </Text>
                <List maxW={516} {...rest}>
                    <FormControl>
                        <FormLabel justifyContent="space-between" display="flex" htmlFor="name">
                            <Span>Wallet Address</Span>
                            {/* <Button
                                textStyle="body2"
                                color="text.accent"
                                fontSize={14}
                                fontWeight={400}
                                onClick={() => setIsModalChnageWalletOpen(true)}
                                variant="link"
                            >
                                Check balance for another address
                            </Button> */}
                            {/* TODO - Fix this button  */}
                        </FormLabel>
                        <CopyPad
                            flex="1"
                            wordBreak="break-all"
                            text={walletAddress ? walletAddress.toString() : '-'}
                        />
                        <FormHelperText color="text.secondary">
                            Connected wallet public address, can be shared to receive jetton
                            transfers
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="name">Wallet Balance</FormLabel>
                        <InputGroup>
                            <Input pr={63} defaultValue={balance} readOnly />
                            <InputRightElement w={63}>
                                <Button
                                    textStyle="label2"
                                    color="text.accent"
                                    fontSize={14}
                                    onClick={() => setIsModalBurnOpen(true)}
                                    variant="link"
                                >
                                    Burn
                                </Button>
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
                    onCheck={setWalletAddress}
                />
                <ModalBurn
                    isOpen={isModalBurnOpen}
                    onClose={() => setIsModalBurnOpen(false)}
                    onBurn={count => {
                        setIsModalBurnOpen(false);
                        alert('Burn ' + count);
                        // jettonStore.burnJetton(count);
                    }}
                    jettonSymbol={jettonMetadata.symbol}
                    jettomDecimals={jettonMetadata.decimals}
                />
            </>
        );
    }
);

export default JettonWallet;
