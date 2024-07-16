import { Avatar, Box, BoxProps, Button, Divider, Flex, FlexProps } from '@chakra-ui/react';
import { FC } from 'react';
import { PlusIcon16, IconButton } from 'src/shared';
import { TrashIcon16 } from 'src/shared/ui/icons/TrashIcon16';

type MemberT = {
    id: number;
    name: string;
    role: Role;
};

enum Role {
    OWNER = 'owner',
    ADMIN = 'admin',
    MEMBER = 'member'
}

const roles: Record<Role, string> = {
    [Role.OWNER]: 'Owner',
    [Role.ADMIN]: 'Admin',
    [Role.MEMBER]: 'User'
};

const Member: FC<FlexProps & { member: MemberT }> = ({ member, ...rest }) => {
    const onClose = () => {
        console.log('Close');
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
                name={member.name}
                size="sm"
                src={`https://avatar.iran.liara.run/public/boy?username=${member.name}`}
            />
            <Box fontWeight={600}>{member.name}</Box>
            <Box color="text.secondary">{roles[member.role]}</Box>

            <IconButton
                aria-label="Remove"
                icon={<TrashIcon16 />}
                onClick={onClose}
                ml="auto"
                p={3}
            />
        </Flex>
    );
};

const mockMembers: MemberT[] = [
    {
        id: 1,
        name: 'Varun Sharma',
        role: Role.OWNER
    },
    {
        id: 2,
        name: 'Poetra Weka',
        role: Role.ADMIN
    },
    {
        id: 3,
        name: '',
        role: Role.MEMBER
    }
];

export const EditMembers: FC<BoxProps> = props => {
    return (
        <Box mb={4} {...props}>
            <Button colorScheme="gray" variant="solid">
                <PlusIcon16 mr={2} color="constant.black" />
                Add user
            </Button>

            <Divider my={4} />

            <Box>
                {mockMembers.map(member => (
                    <Member key={member.id} member={member} />
                ))}
            </Box>
        </Box>
    );
};
