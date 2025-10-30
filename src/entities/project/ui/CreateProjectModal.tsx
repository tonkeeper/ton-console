import { FC } from 'react';
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
import { useCreateProjectMutation } from 'src/shared/queries/projects';
import { useSetProject } from 'src/shared/contexts/ProjectContext';

export const CreateProjectModal: FC<{ isOpen: boolean; onClose: () => void }> = props => {
    const formId = 'create-project-form';
    const createProject = useCreateProjectMutation();
    const setProject = useSetProject();

    const onSubmit = (form: ProjectFormValues): void => {
        createProject.mutate(form, {
            onSuccess: (newProject) => {
                setProject(newProject.id);
                props.onClose();
            }
        });
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
                        isLoading={createProject.isPending}
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
