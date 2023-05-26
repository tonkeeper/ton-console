import { ComponentProps, FunctionComponent, useEffect } from 'react';
import {
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { SearchIcon24, useDebounce, XMarkCircleIcon16 } from 'src/shared';
import { useIMask } from 'react-imask';
import { invoicesTableStore } from 'src/features';

const InvoicesSearchInput: FunctionComponent<ComponentProps<typeof InputGroup>> = props => {
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
                        size="fit"
                        variant="flat"
                    />
                </InputRightElement>
            )}
        </InputGroup>
    );
};

export default observer(InvoicesSearchInput);
