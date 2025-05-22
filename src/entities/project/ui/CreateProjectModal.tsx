import { FunctionComponent } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from '@chakra-ui/react';
import { ProjectForm } from './ProjectForm';
import { ProjectFormValues } from 'src/entities';
import { observer } from 'mobx-react-lite';
import { projectsStore } from 'src/shared/stores';

const CreateProjectModal_: FunctionComponent<{ isOpen: boolean; onClose: () => void }> = props => {
    const formId = 'create-project-form';

    const onSubmit = (form: ProjectFormValues): void => {
        projectsStore.createProject(form).then(props.onClose);
    };

    return (
        <Modal scrollBehavior="inside" {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>New Project</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <ProjectForm id={formId} onSubmit={onSubmit} />
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={props.onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isLoading={projectsStore.createProject.isLoading}
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

export const CreateProjectModal = observer(CreateProjectModal_);
