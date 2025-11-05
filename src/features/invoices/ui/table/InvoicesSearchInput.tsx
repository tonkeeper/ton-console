import { FC, useEffect } from 'react';
import {
    Input,
    InputGroup,
    InputGroupProps,
    InputLeftElement,
    InputRightElement
} from '@chakra-ui/react';
import { IconButton, SearchIcon24, useDebounce, XMarkCircleIcon16 } from 'src/shared';
import { useIMask } from 'react-imask';

interface Props extends InputGroupProps {
    onSearch: (searchId: string | undefined) => void;
}

const InvoicesSearchInput: FC<Props> = ({ onSearch, ...props }) => {
    const { ref, value, setValue } = useIMask({
        mask: /^[a-zA-Z\d]{1,6}$/
    });

    const debouncedValue = useDebounce(value);

    useEffect(() => {
        if (debouncedValue) {
            onSearch(debouncedValue);
        } else {
            onSearch(undefined);
        }
    }, [debouncedValue, onSearch]);

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

export default InvoicesSearchInput;
