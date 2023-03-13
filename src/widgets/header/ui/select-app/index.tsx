import { Menu, MenuButton, MenuItem, MenuList, Image, Text, HStack } from '@chakra-ui/react';
import { ArrowIcon, MenuButtonStyled, TickIcon } from 'src/shared';
import { FunctionComponent, useState } from 'react';

const projectsStub = ['Mexc', 'GetGems', 'Mercutio', 'Coinex'];

export const SelectApp: FunctionComponent = () => {
    const [selectedProjectName, setSelectedProjectName] = useState(projectsStub[2]);

    return (
        <Menu placement="bottom">
            <MenuButton as={MenuButtonStyled} w="240px" rightIcon={<ArrowIcon />}>
                <HStack spacing="2">
                    <Image w="7" h="7" borderRadius="sm" src="assets/images/getgems.png" />
                    <Text textStyle="label2" noOfLines={1}>
                        {selectedProjectName}
                    </Text>
                </HStack>
            </MenuButton>
            <MenuList w="256px">
                {projectsStub.map(projectName => (
                    <MenuItem key={projectName} onClick={() => setSelectedProjectName(projectName)}>
                        <Image
                            w="7"
                            h="7"
                            mr="2"
                            borderRadius="sm"
                            src="assets/images/getgems.png"
                        />
                        <Text textStyle="label2" noOfLines={1}>
                            {projectName}
                        </Text>
                        {projectName === selectedProjectName && <TickIcon ml="auto" />}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};
