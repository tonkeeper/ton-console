import { ComponentProps, FunctionComponent } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';

export const PaymentModal: FunctionComponent<
    Omit<ComponentProps<typeof Modal>, 'children'> & { amount: number }
> = props => {
    const address = '0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F';
    const url = `https://app.tonkeeper.com/transfer/${address}?amount=${props.amount * 10 ** 9}`;

    return (
        <Modal {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Pay for TON API</ModalHeader>
                <ModalCloseButton />
                <ModalBody alignItems="center" flexDir="column" display="flex" pt={0}>
                    <Text maxW="300px" mb={6} color="text.secondary" textAlign="center">
                        Scan QR code below with Tonkeeper wallet or by your phone&apos;s camera.
                    </Text>
                    <QRCodeSVG size={200} value={url} />
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={props.onClose} variant="primary">
                        Done
                    </Button>
                    <Button flex={1} onClick={props.onClose} variant="secondary">
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
