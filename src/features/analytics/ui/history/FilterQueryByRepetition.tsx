import { FC } from 'react';
import { Checkbox, CheckboxProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { analyticsHistoryTableStore } from 'src/features';

const FilterQueryByRepetition: FC<CheckboxProps> = props => {
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
