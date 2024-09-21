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
    FormHelperText
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { JettonInfo } from '@ton-api/client';
import { EditIcon24, IconButton, sliceAddress } from 'src/shared';
import { fromDecimals, toDecimals } from '../../lib/utils';
import { ConfirmationDialog } from 'src/entities';
import { jettonStore } from '../../model';

const Field: FC<{ label: string; value: string; children?: ReactNode }> = ({
    label,
    children,
    value
}) => (
    <Flex gap={2}>
        <Text w="88px" color="text.secondary">
            {label}
        </Text>
        <Text>{value}</Text>
        {children}
    </Flex>
);

const ModalRevokeOwnership: FC<{
    isOpen: boolean;
    onClose: () => void;
    jettonName: string;
}> = ({ isOpen, onClose, jettonName }) => {
    const handleConfirm = () => {
        // TODO: Implement revoke ownership logic
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
    const [value, setValue] = useState(NaN);

    const handleClose = () => {
        setValue(NaN);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Mint {jettonSymbol}</ModalHeader>
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
                        onClick={() => onMint(toDecimals(value, jettomDecimals))}
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

const ModalEdit: FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const handleConfirm = () => {};

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text textStyle="text.body2" color="text.secondary">
                        TODO Implement edit form
                    </Text>
                </ModalBody>

                <ModalFooter>
                    <Button flex={1} onClick={onClose} variant="outline">
                        Cancel
                    </Button>
                    <Button flex={1} ml={3} onClick={handleConfirm}>
                        Edit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

type JettonCardProps = StyleProps & {
    data: JettonInfo;
};

const JettonCard: FC<JettonCardProps> = observer(
    ({
        data: {
            mintable,
            metadata: { name, symbol, image, decimals, description, address },
            totalSupply,
            admin
        },
        ...rest
    }) => {
        const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
        const [isMintModalOpen, setIsMintModalOpen] = useState(false);
        const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
                            onClick={() => setIsEditModalOpen(true)}
                            ml="auto"
                        />
                    )}
                </Flex>
                <Divider />
                <Box textStyle="body2" p={4}>
                    <Field label="Address" value={sliceAddress(address)} />
                    <Field
                        label="Owner"
                        value={admin ? sliceAddress(admin.address) : 'Owner missing'}
                    >
                        {isOwner && (
                            <Button
                                textStyle="body2"
                                color="text.accent"
                                fontWeight={400}
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
                        value={`${fromDecimals(totalSupply, decimals)} ${symbol}`}
                    >
                        {isOwner && mintable && (
                            <Button
                                textStyle="body2"
                                color="text.accent"
                                fontWeight={400}
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
                    jettonName={name}
                />
                <ModalMint
                    isOpen={isMintModalOpen}
                    onClose={() => setIsMintModalOpen(false)}
                    onMint={count => alert(`Minting ${count}`)}
                    jettonSymbol={symbol}
                    jettomDecimals={decimals}
                />
                <ModalEdit isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
            </Box>
        );
    }
);

export default JettonCard;
