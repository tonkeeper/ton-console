import { FC, useEffect } from 'react';
import {
    Input,
    InputGroup,
    InputGroupProps,
    InputLeftElement,
    InputRightElement
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { IconButton, SearchIcon24, useDebounce, XMarkCircleIcon16 } from 'src/shared';
import { useIMask } from 'react-imask';
import { invoicesTableStore } from 'src/features';

const InvoicesSearchInput: FC<InputGroupProps> = props => {
    const { ref, value, setValue } = useIMask({
        mask: /^[a-zA-Z\d]{1,6}$/
    });

    const debouncedValue = useDebounce(value);

    useEffect(() => {
        if (debouncedValue) {
            invoicesTableStore.setFilterById(debouncedValue);
        } else {
            invoicesTableStore.setFilterById(undefined);
        }
    }, [debouncedValue]);

    return (
        <InputGroup {...props}>
            <InputLeftElement pointerEvents="none">
                <SearchIcon24 />
            </InputLeftElement>
            <Input ref={ref} placeholder="Search by ID" />
            {!!value && (
                <InputRightElement>
                    <IconButton
                        aria-label="clear"
                        icon={<XMarkCircleIcon16 />}
                        onClick={() => setValue('')}
                    />
                </InputRightElement>
            )}
        </InputGroup>
    );
};

export default observer(InvoicesSearchInput);
