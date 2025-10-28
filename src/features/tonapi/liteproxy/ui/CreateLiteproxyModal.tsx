import { FC } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text
} from '@chakra-ui/react';
import { useCreateLiteproxyMutation } from 'src/features/tonapi/liteproxy/model/queries';

const CreateLiteproxyModal: FC<{ isOpen: boolean; onClose: () => void }> = props => {
    const { mutate: createLiteproxy, isPending } = useCreateLiteproxyMutation();
    const onSubmit = () => createLiteproxy(undefined, { onSuccess: props.onClose });

    return (
        <Modal scrollBehavior="inside" {...props} size="sm">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create Liteserver?</ModalHeader>

                <ModalBody py={0}>
                    <Text textStyle="body2" color="text.secondary">
                        Will be created a two Liteserver nodes on free tier with 0.1 RPS. You can
                        change the tier later.
                    </Text>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={props.onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        isLoading={isPending}
                        onClick={onSubmit}
                        type="submit"
                        variant="primary"
                    >
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateLiteproxyModal;
