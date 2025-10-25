import { FC } from 'react';
import {
    BoxProps,
    Button,
    Center,
    Checkbox,
    Flex,
    Menu,
    MenuItem,
    MenuList,
    useDisclosure
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { ArrowIcon, MenuButtonDefault, Span, TickIcon } from 'src/shared';
import { analyticsHistoryTableStore, AnalyticsQueryType } from 'src/features';

const QueryTypesLabels: Record<AnalyticsQueryType, string> = {
    sql: 'SQL',
    gpt: 'Chat GPT',
    graph: 'Graph'
};

const FilterQueryByType: FC<BoxProps> = props => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const selectedTypesNumber = analyticsHistoryTableStore.pagination.filter.type?.length;

    return (
        <Menu
            closeOnSelect={false}
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
            placement="bottom-start"
            {...props}
        >
            <MenuButtonDefault px="4" rightIcon={<ArrowIcon />}>
                <Flex textStyle="label2" gap="2">
                    Filter by Type
                    {!!selectedTypesNumber && (
                        <Center
                            textStyle="label3"
                            w="5"
                            h="5"
                            color="icon.contrast"
                            borderRadius="100%"
                            bgColor="text.primary"
                        >
                            {selectedTypesNumber}
                        </Center>
                    )}
                </Flex>
            </MenuButtonDefault>
            <MenuList zIndex={100} w="240px">
                <Flex justify="space-between" mb="2" pt="2" px="1" color="text.secondary">
                    <Span textStyle="label2">Display only</Span>
                    {!!selectedTypesNumber && (
                        <Button
                            onClick={() => {
                                analyticsHistoryTableStore.clearFilterByType();
                                onClose();
                            }}
                            size="fit"
                            variant="flat"
                        >
                            <Span color="text.secondary" textStyle="body2">
                                Clear All
                            </Span>
                        </Button>
                    )}
                </Flex>
                {Object.keys(QueryTypesLabels).map(type => (
                    <MenuItem
                        key={type}
                        onClick={e => {
                            e.preventDefault();
                            analyticsHistoryTableStore.toggleFilterByType(
                                type as AnalyticsQueryType
                            );
                        }}
                    >
                        <Checkbox
                            icon={<TickIcon w="12px" />}
                            id="subtractFeeFromAmount"
                            isChecked={analyticsHistoryTableStore.pagination.filter.type?.includes(
                                type as AnalyticsQueryType
                            )}
                        >
                            {QueryTypesLabels[type as AnalyticsQueryType]}
                        </Checkbox>
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};

export default observer(FilterQueryByType);
