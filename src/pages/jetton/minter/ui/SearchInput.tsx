import {
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    useToast
} from '@chakra-ui/react';
import { Address } from '@ton/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloseIcon24, IconButton, SearchIcon24 } from 'src/shared';

export const SearchInput = () => {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const toast = useToast();

    const handleSearch = () => {
        try {
            const address = Address.parse(searchValue.trim());

            navigate(`/jetton/minter/view?address=${address.toString()}`);
        } catch (error) {
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
            ml="auto"
            transition="width 0.2s"
            size="md"
        >
            <InputLeftElement pointerEvents="none">
                <SearchIcon24 color="text.secondary" />
            </InputLeftElement>
            <Input
                pr={buttonElementsWidth}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 100)}
                onChange={e => setSearchValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search..."
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
                    <Button
                        h="1.75rem"
                        colorScheme="constant.white"
                        onClick={handleSearch}
                        size="sm"
                    >
                        Find
                    </Button>
                )}
            </InputRightElement>
        </InputGroup>
    );
};
