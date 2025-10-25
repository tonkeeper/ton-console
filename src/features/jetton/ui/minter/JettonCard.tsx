import { FC, ReactNode, useState } from 'react';
import {
    Text,
    Avatar,
    Flex,
    Box,
    StyleProps,
    Divider,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    ModalOverlay,
    FormControl,
    Input,
    FormHelperText,
    useToast
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { JettonInfo } from '@ton-api/client';
import {
    CopyPad,
    EditIcon24,
    IconButton,
    sliceAddress,
    toDecimals,
    fromDecimals
} from 'src/shared';
import { ConfirmationDialog } from 'src/entities';
import { JettonStore } from '../../model';
import { useTonConnectUI } from '@tonconnect/ui-react';
import JettonEditForm, { EditJettonMetadata } from './JettonEditForm';
import { FormProvider, useForm } from 'react-hook-form';
import { JettonMetadata } from '../../lib/jetton-minter';

const Field: FC<{ label: string; value: ReactNode; children?: ReactNode }> = ({
    label,
    children,
    value
}) => (
    <Flex gap={2}>
        <Text w="88px" color="text.secondary">
            {label}
        </Text>
        {typeof value === 'string' ? <Text>{value}</Text> : value}
        {children}
    </Flex>
);

const ModalRevokeOwnership: FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    jettonName: string;
}> = ({ isOpen, onClose, onConfirm, jettonName }) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <ConfirmationDialog
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleConfirm}
            title={v => `Revoke ownership of ${v}`}
            description={v => (
                <>
                    <Text textStyle="text.body2" mb="6" color="text.secondary">
                        Are you sure you want to revoke ownership of the jetton <b>{v}</b>
                    </Text>
                </>
            )}
            confirmValue={jettonName}
            confirmButtonText="Revoke"
        />
    );
};

const ModalMint: FC<{
    isOpen: boolean;
    onClose: (reset?: boolean) => void;
    onMint: (count: bigint) => void;
    jettonSymbol: string;
    jettomDecimals: string;
}> = ({ isOpen, onClose, onMint, jettonSymbol, jettomDecimals }) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        setValue('');
        setError(null);
        onClose();
    };

    const handleMint = () => {
        const v = fromDecimals(value, jettomDecimals);
        if (v <= 0n) {
            setError('Amount should be greater than 0');
        } else {
            onMint(v);
            handleClose();
        }
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setError(null);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Mint {jettonSymbol}</ModalHeader>
                <ModalCloseButton />
                <ModalBody py="0">
                    <FormControl my={0} isInvalid={error !== null}>
                        <Input
                            autoComplete="off"
                            autoFocus
                            min={0}
                            onChange={handleValueChange}
                            onKeyDown={e => e.key === 'Enter' && handleMint()}
                            placeholder={`Enter ${jettonSymbol} amount`}
                            type="number"
                            value={value}
                        />
                        <FormHelperText color="text.secondary">
                            Number of tokens to mint
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
                        onClick={handleMint}
                        type="submit"
                        variant="primary"
                    >
                        Mint
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const ModalEdit: FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (value: JettonMetadata) => void;
    jettonStore: JettonStore;
}> = ({ isOpen, onClose, onSubmit, jettonStore }) => {
    const formId = 'jetton-edit-form';

    const metadata = jettonStore.jettonInfo$.value?.metadata;

    if (!metadata) {
        throw new Error('Jetton metadata is missing');
    }

    const methods = useForm<EditJettonMetadata>({
        defaultValues: {
            name: metadata.name,
            symbol: metadata.symbol,
            description: metadata.description,
            image: metadata.image
        }
    });

    const handleConfirm = (values: EditJettonMetadata) => {
        onSubmit({
            name: values.name,
            symbol: values.symbol,
            description: values.description,
            image: values.image,
            decimals: metadata.decimals
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit token</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormProvider {...methods}>
                        <JettonEditForm onSubmit={handleConfirm} id={formId} />
                    </FormProvider>
                </ModalBody>

                <ModalFooter>
                    <Button flex={1} onClick={onClose} variant="outline">
                        Cancel
                    </Button>
                    <Button flex={1} ml={3} onClick={methods.handleSubmit(handleConfirm)}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

type JettonCardProps = StyleProps & {
    data: JettonInfo;
    jettonStore: JettonStore;
};

const JettonCard: FC<JettonCardProps> = observer(
    ({
        data: {
            mintable,
            metadata: { name, symbol, image, decimals, description, address },
            totalSupply,
            admin
        },
        jettonStore,
        ...rest
    }) => {
        const toast = useToast();
        const [tonconnect] = useTonConnectUI();

        const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
        const [isMintModalOpen, setIsMintModalOpen] = useState(false);
        const [isEditModalOpen, setIsEditModalOpen] = useState(false);

        const [isMineProgress, setIsMintProgress] = useState(false);
        const [isRevokeProgress, setIsRevokeProgress] = useState(false);
        const [isEditProgress, setIsEditProgress] = useState(false);

        const handleMint = (count: bigint) => {
            setIsMintProgress(true);

            const toastId = toast({
                title: 'Minting jetton',
                description: 'Please wait...',
                position: 'bottom-left',
                duration: null,
                status: 'loading',
                isClosable: false
            });

            jettonStore
                .mintJetton(count, tonconnect)
                .then(() => {
                    toast.update(toastId, {
                        title: 'Success',
                        description: 'Jetton minted successfully',
                        status: 'success',
                        duration: 5000,
                        isClosable: true
                    });
                })
                .catch(() => {
                    const errorMessage = 'Unknown traking error happened';
                    toast.update(toastId, {
                        title: 'Traking lost',
                        description: errorMessage,
                        status: 'warning',
                        duration: 5000,
                        isClosable: true
                    });
                })
                .finally(() => {
                    jettonStore.updateJettonInfo();
                    setIsMintProgress(false);
                });
        };

        const handleRevokeOwnership = () => {
            setIsRevokeProgress(true);

            const toastId = toast({
                title: 'Revoking ownership',
                description: 'Please wait...',
                position: 'bottom-left',
                duration: null,
                status: 'loading',
                isClosable: false
            });

            jettonStore
                .burnAdmin(tonconnect)
                .then(() => {
                    toast.update(toastId, {
                        title: 'Success',
                        description: 'Ownership revoked successfully',
                        status: 'success',
                        duration: 5000,
                        isClosable: true
                    });
                })
                .catch(() => {
                    const errorMessage = 'Unknown traking error happened';
                    toast.update(toastId, {
                        title: 'Traking lost',
                        description: errorMessage,
                        status: 'warning',
                        duration: 5000,
                        isClosable: true
                    });
                })
                .finally(() => {
                    jettonStore.updateJettonInfo();
                    setIsRevokeProgress(false);
                });
        };

        const handleUpdateMetadata = (values: JettonMetadata) => {
            setIsEditProgress(true);

            const toastId = toast({
                title: 'Editing jetton',
                description: 'Please wait...',
                position: 'bottom-left',
                duration: null,
                status: 'loading',
                isClosable: false
            });

            jettonStore
                .updateMetadata(values, tonconnect)
                .then(() => {
                    toast.update(toastId, {
                        title: 'Success',
                        description: 'Jetton edited successfully',
                        status: 'success',
                        duration: 5000,
                        isClosable: true
                    });
                })
                .catch(() => {
                    const errorMessage = 'Unknown traking error happened';
                    toast.update(toastId, {
                        title: 'Traking lost',
                        description: errorMessage,
                        status: 'warning',
                        duration: 5000,
                        isClosable: true
                    });
                })
                .finally(() => {
                    jettonStore.updateJettonInfo();
                    setIsEditProgress(false);
                });
        };

        const connectedWalletAddress = jettonStore.connectedWalletAddress;
        const isOwner = connectedWalletAddress && admin?.address.equals(connectedWalletAddress);

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
                    {isOwner && (
                        <IconButton
                            aria-label="Remove"
                            icon={<EditIcon24 />}
                            isLoading={isEditProgress}
                            onClick={() => setIsEditModalOpen(true)}
                            ml="auto"
                        />
                    )}
                </Flex>
                <Divider />
                <Box textStyle="body2" p={4}>
                    <Field
                        label="Address"
                        value={
                            <CopyPad
                                variant="flat"
                                size="sm"
                                textView={sliceAddress(address)}
                                text={address.toString()}
                                iconAlign="start"
                                hideCopyIcon
                            />
                        }
                    />
                    <Field
                        label="Owner"
                        value={
                            admin ? (
                                <CopyPad
                                    variant="flat"
                                    size="sm"
                                    textView={sliceAddress(admin.address, { bounceable: false })}
                                    text={admin.address.toString({ bounceable: false })}
                                    iconAlign="start"
                                    hideCopyIcon
                                />
                            ) : (
                                'Owner missing'
                            )
                        }
                    >
                        {isOwner && (
                            <Button
                                textStyle="body2"
                                color={isRevokeProgress ? undefined : 'text.accent'}
                                fontWeight={400}
                                isLoading={isRevokeProgress}
                                onClick={() => setIsRevokeModalOpen(true)}
                                size="sm"
                                variant="link"
                            >
                                Revoke Ownership
                            </Button>
                        )}
                    </Field>
                    <Field label="Symbol" value={symbol} />
                    <Field label="Decimals" value={decimals} />
                    <Field
                        label="Total Supply"
                        value={`${toDecimals(totalSupply, decimals)} ${symbol}`}
                    >
                        {isOwner && mintable && (
                            <Button
                                textStyle="body2"
                                color={isMineProgress ? undefined : 'text.accent'}
                                fontWeight={400}
                                isLoading={isMineProgress}
                                onClick={() => setIsMintModalOpen(true)}
                                size="sm"
                                variant="link"
                            >
                                Mint
                            </Button>
                        )}
                    </Field>
                </Box>
                <ModalRevokeOwnership
                    isOpen={isRevokeModalOpen}
                    onClose={() => setIsRevokeModalOpen(false)}
                    onConfirm={handleRevokeOwnership}
                    jettonName={name}
                />
                <ModalMint
                    isOpen={isMintModalOpen}
                    onClose={() => setIsMintModalOpen(false)}
                    onMint={handleMint}
                    jettonSymbol={symbol}
                    jettomDecimals={decimals}
                />
                <ModalEdit
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleUpdateMetadata}
                    jettonStore={jettonStore}
                />
            </Box>
        );
    }
);

export default JettonCard;
