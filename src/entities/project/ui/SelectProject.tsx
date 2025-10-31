import {
    Menu,
    MenuItem,
    MenuList,
    Text,
    HStack,
    Box,
    Center,
    useDisclosure,
    Tooltip,
    BoxProps
} from '@chakra-ui/react';
import {
    ArrowIcon,
    MenuButtonDefault,
    TickIcon,
    Image,
    PlusIcon16,
    TooltipHoverable,
    Span,
    useIsTextTruncated
} from 'src/shared';
import { FC } from 'react';
import { Project } from 'src/entities/project';
import { useMaybeProject, useSetProject } from 'src/shared/contexts/ProjectContext';
import { useProjectsQuery } from 'src/shared/queries/projects';
import { CreateProjectModal } from './CreateProjectModal';
import { useUserQuery } from 'src/entities/user/queries';

const SelectProject: FC<BoxProps> = props => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const selectedProject = useMaybeProject();
    const { data: user } = useUserQuery();
    const { data: projects = [] } = useProjectsQuery({ enabled: !!user });

    if (!selectedProject) {
        return null;
    }
    const isLimitReached = projects.length >= 10;

    const createProjectMenuItem = ({ isDisabled }: { isDisabled: boolean }) => (
        <MenuItem isDisabled={isDisabled} onClick={() => !isDisabled && onOpen()}>
            <Center w="7" minW="7" h="7" mr="2" borderRadius="sm" bgColor="background.contentTint">
                <PlusIcon16 />
            </Center>
            <Text textStyle="label2" color="text.primary" noOfLines={1}>
                Create Project
            </Text>
        </MenuItem>
    );

    return (
        <Box {...props}>
            <Menu placement="bottom">
                <MenuButtonDefault w="240px" rightIcon={<ArrowIcon />}>
                    <HStack spacing="2">
                        {selectedProject.imgUrl ? (
                            <Image
                                w="7"
                                minW="7"
                                h="7"
                                borderRadius="sm"
                                src={selectedProject.imgUrl}
                            />
                        ) : (
                            <Center
                                w="7"
                                minW="7"
                                h="7"
                                mr="2"
                                color="constant.white"
                                bg={selectedProject.fallbackBackground}
                                borderRadius="sm"
                            >
                                {selectedProject.name[0]}
                            </Center>
                        )}
                        <Text textStyle="label2" noOfLines={1}>
                            {selectedProject.name}
                        </Text>
                    </HStack>
                </MenuButtonDefault>
                <MenuList zIndex={100} w="256px">
                    {projects.map(project => (
                        <SelectProjectItem
                            project={project}
                            key={project.id}
                            isSelected={project.id === selectedProject.id}
                        />
                    ))}

                    {isLimitReached ? (
                        <Tooltip hasArrow label="Project limit reached (10 max)">
                            {createProjectMenuItem({ isDisabled: true })}
                        </Tooltip>
                    ) : (
                        createProjectMenuItem({ isDisabled: false })
                    )}
                </MenuList>
            </Menu>
            <CreateProjectModal isOpen={isOpen} onClose={onClose} />
        </Box>
    );
};

const SelectProjectItem: FC<{ project: Project; isSelected: boolean }> = ({
    project,
    isSelected
}) => {
    const { ref, isTruncated } = useIsTextTruncated();
    const setProject = useSetProject();

    return (
        <TooltipHoverable
            key={project.id}
            placement="right"
            canBeShown={isTruncated}
            host={
                <MenuItem onClick={() => setProject(project.id)}>
                    {project.imgUrl ? (
                        <Image w="7" minW="7" h="7" mr="2" borderRadius="sm" src={project.imgUrl} />
                    ) : (
                        <Center
                            w="7"
                            minW="7"
                            h="7"
                            mr="2"
                            color="constant.white"
                            bg={project.fallbackBackground}
                            borderRadius="sm"
                        >
                            {project.name[0]}
                        </Center>
                    )}
                    <Span
                        ref={ref}
                        textStyle="label2"
                        color="text.primary"
                        layerStyle="textEllipse"
                        whiteSpace="nowrap"
                    >
                        {project.name}
                    </Span>
                    {isSelected && <TickIcon ml="auto" />}
                </MenuItem>
            }
        >
            {project.name}
        </TooltipHoverable>
    );
};

export { SelectProject };
