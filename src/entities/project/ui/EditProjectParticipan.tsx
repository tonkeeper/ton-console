import { Avatar, Box, BoxProps, Button, Divider, Flex, FlexProps } from '@chakra-ui/react';
import { FC } from 'react';
import { PlusIcon16, IconButton, DTOParticipant } from 'src/shared';
import { TrashIcon16 } from 'src/shared/ui/icons/TrashIcon16';
import { projectsStore } from '../model';
import { observer } from 'mobx-react-lite';

const Participant: FC<FlexProps & { participant: DTOParticipant }> = ({ participant, ...rest }) => {
    const name = [participant.first_name, participant.last_name].join(' ');

    const onRemove = () => {
        projectsStore.deleteProjectParticipant(participant.id); // TODO: add confirmation modal
    };

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
            <Box fontWeight={600}>{name}</Box>

            <IconButton
                aria-label="Remove"
                icon={<TrashIcon16 />}
                onClick={onRemove}
                ml="auto"
                p={3}
            />
        </Flex>
    );
};

export const EditProjectParticipan: FC<
    BoxProps & {
        onAddParticipan: () => void;
    }
> = observer(({ onAddParticipan, ...rest }) => {
    const participans = projectsStore.projectParticipants$.value;
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
                    <Participant key={participant.id} participant={participant} />
                ))}
            </Box>
        </Box>
    );
});
