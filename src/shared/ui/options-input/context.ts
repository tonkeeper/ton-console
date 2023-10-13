import { createContext } from 'react';
import { useRadioGroup } from '@chakra-ui/react';

export const OptionsInputContext = createContext<{
    getRadioProps?: ReturnType<typeof useRadioGroup>['getRadioProps'];
    setInputValue?: (value: string) => void;
    inputType?: 'radio' | 'text';
    setInputType?: (value: 'radio' | 'text') => void;
}>({});
