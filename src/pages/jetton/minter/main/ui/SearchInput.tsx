import {
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    StyleProps,
    useToast
} from '@chakra-ui/react';
import { Address } from '@ton/core';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloseIcon24, IconButton, SearchIcon24 } from 'src/shared';

export const SearchInput: FC<StyleProps> = props => {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const toast = useToast();

    const handleSearch = () => {
        try {
            const address = Address.parse(searchValue.trim());

            navigate(`/jetton/minter/view/${address.toString()}`);
        } catch (_error) {
            toast({
                title: 'Invalid address',
                status: 'error',
                duration: 5000,
                position: 'bottom-left',
                isClosable: true
            });
        }
    };

    const buttonElementsWidth = searchValue ? '100px' : '0px';

    return (
        <InputGroup
            w={isSearchFocused ? '533px' : '320px'}
            transition="width 0.2s"
            size="md"
            {...props}
        >
            <InputLeftElement pointerEvents="none">
                <SearchIcon24 color="text.secondary" />
            </InputLeftElement>
            <Input
                pr={buttonElementsWidth}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 100)}
                onChange={e => setSearchValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Jetton Address"
                value={searchValue}
            />
            <InputRightElement gap={1} display="flex" w={buttonElementsWidth} ml="auto">
                {searchValue && (
                    <IconButton
                        aria-label="clear search"
                        icon={<CloseIcon24 />}
                        onClick={() => setSearchValue('')}
                    />
                )}
                {searchValue && (
                    <Button h="1.75rem" onClick={handleSearch} size="sm" variant="overlay">
                        Find
                    </Button>
                )}
            </InputRightElement>
        </InputGroup>
    );
};
