import { FC } from 'react';
import { ButtonGroup, Button, HStack } from '@chakra-ui/react';
import { TimePeriod, getAllPeriods } from '../model/time-periods';

interface PeriodSelectorProps {
    value: TimePeriod;
    onChange: (period: TimePeriod) => void;
}

const PeriodSelector: FC<PeriodSelectorProps> = ({ value, onChange }) => {
    const periods = getAllPeriods();

    return (
        <HStack spacing="2">
            <ButtonGroup isAttached size="sm" variant="outline">
                {periods.map(period => (
                    <Button
                        key={period.value}
                        isActive={value === period.value}
                        onClick={() => onChange(period.value)}
                    >
                        {period.label}
                    </Button>
                ))}
            </ButtonGroup>
        </HStack>
    );
};

export default PeriodSelector;
