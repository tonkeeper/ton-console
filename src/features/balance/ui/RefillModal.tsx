import { FunctionComponent } from 'react';
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
import { CopyPad, H4, Pad } from 'src/shared';
import { QRCodeSVG } from 'qrcode.react';

export const RefillModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
}> = props => {
    return (
        <Modal scrollBehavior="inside" size="md" {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <H4 mb="1">Balance Refill</H4>
                    <Text textStyle="body2" color="text.secondary">
                        Scan QR code for refill or send Toncoin by address bellow. Send only Toncoin
                        on this address. Sending other coins may result in permanent loss.
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pt="0" pb="4">
                    <Pad mb="4" display="flex" alignItems="center" justifyContent="center">
                        <QRCodeSVG bgColor="transparent" size={180} value="https://google.com" />
                    </Pad>
                    <CopyPad text="EQAwWyoeWTtAcXh_M4x8bRv2e4CaQ4wRnBPK9sQBfCdEY5ll" />
                </ModalBody>

                <ModalFooter gap="3" pt="0">
                    <Button flex={1} onClick={props.onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button flex={1} onClick={props.onClose} variant="primary">
                        Done
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
