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
    InputRightElement
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { Address } from '@ton/core';
import { useTonAddress } from '@tonconnect/ui-react';
import { CopyPad, Span, isAddressValid } from 'src/shared';
import { JettonStore } from '../../model';
import { fromDecimals } from '../../lib/utils';

type JettonWalletProps = StyleProps & {
    jettonStore: JettonStore;
};

const ModalChnageWallet: FC<{
    isOpen: boolean;
    onClose: (reset?: boolean) => void;
    onChange: (address: Address) => void;
}> = ({ isOpen, onClose, onChange }) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setError(false);
    };

    const handleSelect = () => {
        if (isAddressValid(value)) {
            onChange(Address.parse(value));
        } else {
            setError(true);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={() => onClose()} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Check balance for another address</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb="0">
                    <FormControl mb={0}>
                        <FormLabel htmlFor="name">Wallet Address</FormLabel>
                        <Input
                            autoComplete="off"
                            autoFocus
                            onChange={handleChange}
                            placeholder="Wallet Address"
                            value={value}
                        />
                        <FormHelperText color="text.secondary">
                            Connected wallet public address, can be shared to receive jetton
                            transfers
                        </FormHelperText>
                        <FormErrorMessage>{error && 'Invalid address'}</FormErrorMessage>
                    </FormControl>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={() => onClose()} variant="secondary">
                        Cancel
                    </Button>
                    <Button flex={1} onClick={handleSelect} type="submit" variant="primary">
                        Change
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
}> = ({ isOpen, onClose, onBurn }) => {
    return (
        <Modal isOpen={isOpen} onClose={() => onClose()} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Burn Jetton</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb="0">
                    <FormControl mb={0}>
                        <FormLabel htmlFor="name">Burn Jetton</FormLabel>
                        <Input
                            autoComplete="off"
                            autoFocus
                            min={0}
                            placeholder="Count"
                            type="number"
                        />
                        <FormHelperText color="text.secondary">
                            Number of tokens to burn from connected wallet
                        </FormHelperText>
                    </FormControl>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={() => onClose()} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        onClick={() => onBurn(BigInt(0))}
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

const JettonWallet: FC<JettonWalletProps> = observer(({ jettonStore, ...rest }) => {
    const tonconnectAddressStr = useTonAddress();
    const tonconnectAddress = isAddressValid(tonconnectAddressStr)
        ? Address.parse(tonconnectAddressStr)
        : null;

    const [walletAddress, setWalletAddress] = useState<Address | null>(tonconnectAddress);
    const [isModalChnageWalletOpen, setIsModalChnageWalletOpen] = useState(false);
    const [isModalBurnOpen, setIsModalBurnOpen] = useState(false);

    useEffect(() => {
        if (walletAddress) {
            jettonStore.fetchJettonDetails(walletAddress);
        }
    }, [walletAddress, jettonStore]);

    const jettonData = jettonStore.jettonData$.value;
    if (jettonData === null) {
        return null;
    }

    const jettonWallet = jettonData.jettonWallet;
    const balance = jettonWallet
        ? fromDecimals(jettonWallet.balance, jettonData.minter.metadata.decimals)
        : '-';

    return (
        <>
            <List maxW={516} {...rest}>
                <FormControl>
                    <FormLabel justifyContent="space-between" display="flex" htmlFor="name">
                        <Span>Wallet Address</Span>
                        <Button
                            textStyle="body2"
                            color="text.accent"
                            fontSize={14}
                            fontWeight={400}
                            onClick={() => setIsModalChnageWalletOpen(true)}
                            variant="link"
                        >
                            Check balance for another address
                        </Button>
                    </FormLabel>
                    <CopyPad
                        flex="1"
                        wordBreak="break-all"
                        text={walletAddress ? walletAddress.toString() : '-'}
                    />
                    <FormHelperText color="text.secondary">
                        Connected wallet public address, can be shared to receive jetton transfers
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
                onChange={setWalletAddress}
            />
            <ModalBurn
                isOpen={isModalBurnOpen}
                onClose={() => setIsModalBurnOpen(false)}
                onBurn={count => {
                    setIsModalBurnOpen(false);
                    alert('Burn ' + count);
                    // jettonStore.burnJetton(count);
                }}
            />
        </>
    );
});

export default JettonWallet;
