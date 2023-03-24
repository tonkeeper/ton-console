import { Menu, MenuButton, MenuItem, MenuList, Image, Text, HStack, Box } from '@chakra-ui/react';
import { ArrowIcon, MenuButtonStyled, TickIcon } from 'src/shared';
import { ComponentProps, FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import { projectsStore } from 'src/entities/project';

const component: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Box {...props}>
            {projectsStore.selectedProject && (
                <Menu placement="bottom">
                    <MenuButton as={MenuButtonStyled} w="240px" rightIcon={<ArrowIcon />}>
                        <HStack spacing="2">
                            <Image
                                w="7"
                                h="7"
                                borderRadius="sm"
                                src={projectsStore.selectedProject.imgUrl}
                            />
                            <Text textStyle="label2" noOfLines={1}>
                                {projectsStore.selectedProject.name}
                            </Text>
                        </HStack>
                    </MenuButton>
                    <MenuList w="256px">
                        {projectsStore.projects.map(project => (
                            <MenuItem
                                key={project.id}
                                onClick={() => projectsStore.selectProject(project.id)}
                            >
                                <Image
                                    w="7"
                                    h="7"
                                    mr="2"
                                    borderRadius="sm"
                                    src={projectsStore.selectedProject!.imgUrl}
                                />
                                <Text textStyle="label2" noOfLines={1}>
                                    {project.name}
                                </Text>
                                {project.id === projectsStore.selectedProject!.id && (
                                    <TickIcon ml="auto" />
                                )}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            )}
        </Box>
    );
};

export const SelectProject = observer(component);
