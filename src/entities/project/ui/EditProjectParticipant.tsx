import {
    Avatar,
    Box,
    BoxProps,
    Button,
    Flex,
    FlexProps,
    Text,
    useDisclosure
} from '@chakra-ui/react';
import { FC } from 'react';
import { DTOParticipant, IconButton, PlusIcon16, Span, TrashIcon16 } from 'src/shared';
import { ConfirmationDialog } from 'src/entities';
import { useProjectId } from 'src/shared/contexts/ProjectContext';
import {
    useDeleteProjectParticipantMutation,
    useProjectParticipantsQuery
} from 'src/shared/queries/projects';
import { useUserQuery } from 'src/entities/user/queries';

const getParticipantName = (participant: DTOParticipant) => {
    return [participant.first_name, participant.last_name].filter(Boolean).join(' ') || 'User';
};

const RemoveConfirmationModal: FC<{
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

const Participant: FC<
    FlexProps & {
        participant: DTOParticipant;
        projectId: number;
        isCurrentUser: boolean;
    }
> = ({ participant, projectId, isCurrentUser, ...rest }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const name = getParticipantName(participant);

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
                {name}
                {isCurrentUser && (
                    <Span color="text.secondary" ml={1}>
                        (you)
                    </Span>
                )}
                {!isCurrentUser && (
                    <Span color="text.secondary" fontSize={14} ml={1}>
                        #{participant.id}
                    </Span>
                )}
            </Box>

            {!isCurrentUser && (
                <>
                    <IconButton
                        aria-label="Remove"
                        icon={<TrashIcon16 />}
                        ml="auto"
                        onClick={onOpen}
                        p={3}
                    />
                    <RemoveConfirmationModal
                        isOpen={isOpen}
                        onClose={onClose}
                        participant={participant}
                        projectId={projectId}
                    />
                </>
            )}
        </Flex>
    );
};

export const EditProjectParticipant: FC<
    BoxProps & {
        onAddParticipant: () => void;
    }
> = ({ onAddParticipant, ...rest }) => {
    const projectId = useProjectId();
    const { data: user } = useUserQuery();
    const { data: participants = [] } = useProjectParticipantsQuery(projectId);

    // Sort: current user first, then others alphabetically
    const sortedParticipants = [...participants].sort((a, b) => {
        const aIsCurrentUser = a.id === user?.id;
        const bIsCurrentUser = b.id === user?.id;

        if (aIsCurrentUser) return -1;
        if (bIsCurrentUser) return 1;

        const nameA = getParticipantName(a).toLowerCase();
        const nameB = getParticipantName(b).toLowerCase();
        return nameA.localeCompare(nameB);
    });

    return (
        <Box {...rest}>
            {/* Header with title and Add button */}
            <Flex align="center" justify="space-between" mb={4}>
                <Text textStyle="label1">Team Access</Text>
                <Button
                    leftIcon={<PlusIcon16 />}
                    onClick={onAddParticipant}
                    size="sm"
                    variant="secondary"
                >
                    <Box as="span" display={{ base: 'none', sm: 'inline' }}>
                        Add user
                    </Box>
                </Button>
            </Flex>

            {/* Participants list */}
            {sortedParticipants.length > 0 && projectId && (
                <Box>
                    {sortedParticipants.map(participant => (
                        <Participant
                            key={participant.id}
                            isCurrentUser={participant.id === user?.id}
                            participant={participant}
                            projectId={projectId}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};
