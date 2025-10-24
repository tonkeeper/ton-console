import { ComponentProps, FC } from 'react';
import { Box, Button, Divider, Flex } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { EmptyFolderIcon48, H4, Overlay } from 'src/shared';
import { Link } from 'react-router-dom';

const DashboardPage: FC<ComponentProps<typeof Box>> = props => {
    return (
        <Box {...props}>
            <Overlay>
                <Flex justify="space-between" mb="5">
                    <H4>Dashboard</H4>
                    <Button as={Link} to="../query" variant="secondary">
                        New Request
                    </Button>
                </Flex>
                <Divider w="auto" mx="-6" />
                <Flex align="center" justify="center" direction="column" h="212px" px="6" py="4">
                    <EmptyFolderIcon48 color="icon.tertiary" mb="2" />
                    <Box color="text.secondary" textAlign="center">
                        No favorites yet! <br /> Dashboards you favorite will show up here.
                    </Box>
                </Flex>
            </Overlay>
        </Box>
    );
};

export default observer(DashboardPage);
