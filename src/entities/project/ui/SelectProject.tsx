import {
    Menu,
    MenuItem,
    MenuList,
    Text,
    HStack,
    Box,
    Center,
    useDisclosure,
    Tooltip
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
import { ComponentProps, FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import { Project } from 'src/entities/project';
import { projectsStore } from 'src/shared/stores';
import { CreateProjectModal } from './CreateProjectModal';

const SelectProject_: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!projectsStore.selectedProject) {
        return null;
    }
    const isLimitReached = projectsStore.projects$.value.length >= 10;

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
                        {projectsStore.selectedProject.imgUrl ? (
                            <Image
                                w="7"
                                minW="7"
                                h="7"
                                borderRadius="sm"
                                src={projectsStore.selectedProject.imgUrl}
                            />
                        ) : (
                            <Center
                                w="7"
                                minW="7"
                                h="7"
                                mr="2"
                                color="constant.white"
                                bg={projectsStore.selectedProject.fallbackBackground}
                                borderRadius="sm"
                            >
                                {projectsStore.selectedProject.name[0]}
                            </Center>
                        )}
                        <Text textStyle="label2" noOfLines={1}>
                            {projectsStore.selectedProject.name}
                        </Text>
                    </HStack>
                </MenuButtonDefault>
                <MenuList zIndex={100} w="256px">
                    {projectsStore.projects$.value.map(project => (
                        <SelectProjectItem project={project} key={project.id} />
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

const SelectProjectItem = observer<{ project: Project }>(({ project }) => {
    const { ref, isTruncated } = useIsTextTruncated();
    return (
        <TooltipHoverable
            key={project.id}
            placement="right"
            canBeShown={isTruncated}
            host={
                <MenuItem onClick={() => projectsStore.selectProject(project.id)}>
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
                    {project.id === projectsStore.selectedProject!.id && <TickIcon ml="auto" />}
                </MenuItem>
            }
        >
            {project.name}
        </TooltipHoverable>
    );
});

export const SelectProject = observer(SelectProject_);
