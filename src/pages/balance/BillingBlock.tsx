import { FC, useEffect, useState } from 'react';
import {
    Box,
    Button,
    HStack,
    Select
} from '@chakra-ui/react';
import { H4, useBillingHistoryQuery } from 'src/shared';
import { useProjectId } from 'src/shared/contexts/ProjectContext';
import { BillingHistoryTable, useBillingCsvExport } from 'src/features/billing';

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

const BillingBlock: FC = () => {
    const [hasEverLoaded, setHasEverLoaded] = useState(false);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [pageNumber, setPageNumber] = useState(1);
    const [cursorStack, setCursorStack] = useState<string[]>([]);
    const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);
    const projectId = useProjectId();
    const { isExporting, exportedCount, exportFullHistory } = useBillingCsvExport();

    const { data: billingHistory = [], isLoading } = useBillingHistoryQuery({
        before_tx: currentCursor,
        limit: pageSize
    });
    const hasBillingHistory = billingHistory.length > 0;

    // Reset pagination when project changes
    useEffect(() => {
        setCursorStack([]);
        setCurrentCursor(undefined);
        setPageNumber(1);
    }, [projectId]);

    // Track whether data has ever been loaded
    useEffect(() => {
        if (!isLoading && hasBillingHistory && billingHistory) {
            setHasEverLoaded(true);
        }
    }, [isLoading, hasBillingHistory, billingHistory?.length]);

    // Always use pageSize for skeleton row count to prevent layout jump
    const skeletonRowCount = pageSize;

    const canGoNext = billingHistory.length === pageSize;
    const canGoPrevious = cursorStack.length > 0;

    const handleNext = () => {
        if (billingHistory.length > 0) {
            const lastItemId = billingHistory[billingHistory.length - 1].id;
            setCursorStack(prev => [...prev, currentCursor ?? '']);
            setCurrentCursor(lastItemId);
            setPageNumber(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (cursorStack.length > 0) {
            const newStack = [...cursorStack];
            const previousCursor = newStack.pop();
            setCursorStack(newStack);
            setCurrentCursor(previousCursor === '' ? undefined : previousCursor);
            setPageNumber(prev => prev - 1);
        }
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCursorStack([]);
        setCurrentCursor(undefined);
        setPageNumber(1);
    };

    const handleExportFullHistory = async () => {
        await exportFullHistory();
    };

    return (
        <Box px="6" py="5">
            <HStack align="center" justify="space-between" mb="5">
                <H4 m="0">Billing History</H4>
                <Button
                    isDisabled={!projectId || isExporting}
                    onClick={handleExportFullHistory}
                    size="sm"
                    variant="secondary"
                >
                    {isExporting ? `Exporting (${exportedCount})...` : 'Download CSV'}
                </Button>
            </HStack>
            <BillingHistoryTable
                billingHistory={billingHistory}
                isLoading={isLoading}
                hasEverLoaded={hasEverLoaded}
                skeletonRowCount={skeletonRowCount}
                hasBillingHistory={hasBillingHistory}
            />
            {hasEverLoaded && (
                <HStack justify="space-between" gap="4" mt="2">
                    <Select
                        w="auto"
                        maxW="100px"
                        isDisabled={isLoading}
                        onChange={e => handlePageSizeChange(Number(e.target.value))}
                        size="sm"
                        value={pageSize}
                    >
                        {PAGE_SIZE_OPTIONS.map(size => (
                            <option key={size} value={size}>
                                {size} rows
                            </option>
                        ))}
                    </Select>
                    <HStack gap="2">
                        <Button
                            isDisabled={!canGoPrevious || isLoading}
                            onClick={handlePrevious}
                            size="sm"
                            variant="secondary"
                        >
                            Previous
                        </Button>
                        <Box minW="65px" color="text.secondary" fontSize="sm" textAlign="center">
                            Page {pageNumber}
                        </Box>
                        <Button
                            isDisabled={!canGoNext || isLoading}
                            onClick={handleNext}
                            size="sm"
                            variant="secondary"
                        >
                            Next
                        </Button>
                    </HStack>
                </HStack>
            )}
        </Box>
    );
};

export default BillingBlock;
