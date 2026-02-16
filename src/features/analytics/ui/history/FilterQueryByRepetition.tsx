import { FC } from 'react';
import { Checkbox, CheckboxProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { AnalyticsHistoryTableStore } from 'src/features';

interface FilterQueryByRepetitionProps extends CheckboxProps {
    analyticsHistoryTableStore: AnalyticsHistoryTableStore;
}

const FilterQueryByRepetition: FC<FilterQueryByRepetitionProps> = ({
    analyticsHistoryTableStore,
    ...props
}) => {
    return (
        <Checkbox
            h="fit-content"
            checked={analyticsHistoryTableStore.pagination.filter.onlyRepeating}
            defaultChecked={analyticsHistoryTableStore.pagination.filter.onlyRepeating}
            onChange={() => analyticsHistoryTableStore.toggleFilterByRepeating()}
            {...props}
        >
            Only Repetitive
        </Checkbox>
    );
};

export default observer(FilterQueryByRepetition);
