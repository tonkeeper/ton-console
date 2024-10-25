import { HStack, IconButton, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <HStack justifyContent="end" mt={4} mr={2} spacing={4}>
            <IconButton
                w={8}
                h={8}
                aria-label="Previous Page"
                icon={<ChevronLeftIcon />}
                isDisabled={currentPage === 1}
                onClick={handlePrevPage}
            />
            <Text>
                Page {currentPage} of {totalPages}
            </Text>
            <IconButton
                w={8}
                h={8}
                aria-label="Next Page"
                icon={<ChevronRightIcon />}
                isDisabled={currentPage === totalPages}
                onClick={handleNextPage}
            />
        </HStack>
    );
};

export default Pagination;
