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
import { useFeedbackModal } from './contexts/FeedbackModalContext';
import { useSendFeedbackMutation } from './model/queries';

const FeedbackModal: FC = () => {
    const formId = 'feedback-form';
    const { isOpen, close } = useFeedbackModal();
    const { isPending } = useSendFeedbackMutation();

    return (
        <Modal isOpen={isOpen} onClose={close} scrollBehavior="inside" size="2xl">
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader pb={0}>
                    <H4>Contact form</H4>
                </ModalHeader>
                <ModalBody>
                    <Flex direction="column">
                        <Box mb="4">
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
                    <Button flex={1} onClick={close} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isLoading={isPending}
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

export default FeedbackModal;
