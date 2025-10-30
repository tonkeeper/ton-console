import {
    Avatar,
    Box,
    BoxProps,
    Button,
    Divider,
    Flex,
    FlexProps,
    useDisclosure,
    Text
} from '@chakra-ui/react';
import { FC } from 'react';
import { PlusIcon16, IconButton, DTOParticipant, Span } from 'src/shared';
import { TrashIcon16 } from 'src/shared';
import { ConfirmationDialog } from 'src/entities';
import { useProjectId } from 'src/shared/contexts/ProjectContext';
import {
    useProjectParticipantsQuery,
    useDeleteProjectParticipantMutation
} from 'src/shared/queries/projects';

const getParticipantName = (participant: DTOParticipant) => {
    return [participant.first_name, participant.last_name].join(' ');
};

const DeleteConfirmationModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    participant: DTOParticipant;
    projectId: number;
}> = ({ isOpen, onClose, participant, projectId }) => {
    const deleteParticipant = useDeleteProjectParticipantMutation(projectId);

    const handleDelete = () => {
        deleteParticipant.mutate(participant.id, {
            onSuccess: onClose
        });
    };

    return (
        <ConfirmationDialog
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleDelete}
            title="Confirm you want to remove this user?"
            description={
                <Text>
                    Once removed, <b>{getParticipantName(participant)}</b> will no longer have
                    direct access to this project.
                </Text>
            }
            confirmButtonText="Remove"
        />
    );
};

const Participant: FC<FlexProps & { participant: DTOParticipant; projectId: number }> = ({
    participant,
    projectId,
    ...rest
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const name = [participant.first_name, participant.last_name].join(' ');

    return (
        <Flex
            align="center"
            gap={2}
            h={12}
            fontWeight={600}
            borderRadius={8}
            _hover={{ bg: 'background.contentTint' }}
            {...rest}
        >
            <Avatar ml={2} name={name} size="sm" src={participant.avatar} />
            <Box fontWeight={600}>
                {name}{' '}
                <Span fontSize={14} color="text.secondary">
                    #{participant.id}
                </Span>
            </Box>

            <IconButton
                aria-label="Remove"
                icon={<TrashIcon16 />}
                onClick={() => onOpen()}
                ml="auto"
                p={3}
            />

            <DeleteConfirmationModal
                isOpen={isOpen}
                onClose={onClose}
                participant={participant}
                projectId={projectId}
            />
        </Flex>
    );
};

export const EditProjectParticipan: FC<
    BoxProps & {
        onAddParticipan: () => void;
    }
> = ({ onAddParticipan, ...rest }) => {
    const projectId = useProjectId();
    const { data: participans = [] } = useProjectParticipantsQuery(projectId, undefined);
    const isParticipantsEmpty = participans.length === 0;

    return (
        <Box mb={4} {...rest}>
            <Button colorScheme="gray" onClick={onAddParticipan} variant="solid">
                <PlusIcon16 mr={2} color="constant.black" />
                Add user
            </Button>

            {!isParticipantsEmpty && <Divider my={4} />}

            <Box>
                {participans.map(participant => (
                    <Participant
                        key={participant.id}
                        participant={participant}
                        projectId={projectId}
                    />
                ))}
            </Box>
        </Box>
    );
};
