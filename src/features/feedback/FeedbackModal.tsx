import { FC } from 'react';
import {
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalFooter,
    Box,
    Text
} from '@chakra-ui/react';
import { H4 } from 'src/shared';
import { FeedbackFrom } from './FeedbackForm';
import { observer } from 'mobx-react-lite';
import { feetbackModalStore } from './model/feedback';

const FeedbackModal: FC = () => {
    const formId = 'feedback-form';

    const onClose = () => feetbackModalStore.close();

    return (
        <Modal
            isOpen={feetbackModalStore.isOpen}
            onClose={onClose}
            scrollBehavior="inside"
            size="2xl"
        >
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader pb={0}>
                    <H4>Contact form</H4>
                </ModalHeader>
                <ModalBody>
                    <Flex direction="column">
                        <Box mb="4">
                            {/* <Text textStyle="label2">Ton Console</Text> */}
                            <Text textStyle="body2">
                                Your message has been successfully submitted. We will review it
                                shortly and get back to you using the contact information you
                                provided.
                            </Text>
                        </Box>
                        <FeedbackFrom formId={formId} />
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isLoading={feetbackModalStore.sendForm.isLoading}
                        type="submit"
                        variant="primary"
                    >
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(FeedbackModal);
