import { Avatar, Box, BoxProps, Button, Divider, Flex, FlexProps } from '@chakra-ui/react';
import { FC } from 'react';
import { PlusIcon16, IconButton } from 'src/shared';
import { TrashIcon16 } from 'src/shared/ui/icons/TrashIcon16';

type ParticipanT = {
    id: number;
    name: string;
};

const Participan: FC<FlexProps & { participan: ParticipanT }> = ({ participan, ...rest }) => {
    const onRemove = () => {
        console.log('Remove'); // TODO: Implement
    };

    return (
        <Flex
            align="center"
            gap={2}
            h={12}
            // fontSize={14}
            fontWeight={600}
            borderRadius={8}
            _hover={{ bg: 'background.contentTint' }}
            {...rest}
        >
            <Avatar
                ml={2}
                name={participan.name}
                size="sm"
                src={`https://avatar.iran.liara.run/public/boy?username=${participan.name}`}
            />
            <Box fontWeight={600}>{participan.name}</Box>

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

const mockParticipans: ParticipanT[] = [
    {
        id: 1,
        name: 'Varun Sharma'
    },
    {
        id: 2,
        name: 'Poetra Weka'
    },
    {
        id: 3,
        name: ''
    }
];

export const EditProjectParticipan: FC<
    BoxProps & {
        onAddParticipan: () => void;
    }
> = ({ onAddParticipan, ...rest }) => {
    return (
        <Box mb={4} {...rest}>
            <Button colorScheme="gray" onClick={onAddParticipan} variant="solid">
                <PlusIcon16 mr={2} color="constant.black" />
                Add user
            </Button>

            <Divider my={4} />

            <Box>
                {mockParticipans.map(participan => (
                    <Participan key={participan.id} participan={participan} />
                ))}
            </Box>
        </Box>
    );
};
