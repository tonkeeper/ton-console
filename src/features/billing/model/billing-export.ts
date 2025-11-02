import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { getProjectBillingHistory } from 'src/shared/api';
import { mapDTOTransactionToBillingHistoryItem } from 'src/shared/hooks/useBillingHistoryQuery';
import { useProjectId, useMaybeProject } from 'src/shared/contexts/ProjectContext';
import {
    buildBillingHistoryCsv,
    buildBillingHistoryFilename,
    delay,
    downloadCsvFile,
    EXPORT_PAGE_SIZE,
    MIN_REQUEST_INTERVAL_MS
} from './csv-export';

export interface UseBillingExportReturn {
    isExporting: boolean;
    exportedCount: number;
    exportFullHistory: () => Promise<void>;
}

export function useBillingCsvExport(): UseBillingExportReturn {
    const [isExporting, setIsExporting] = useState(false);
    const [exportedCount, setExportedCount] = useState(0);
    const projectId = useProjectId();
    const project = useMaybeProject();
    const toast = useToast();
    const isMountedRef = useRef(true);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const exportFullHistory = useCallback(async () => {
        if (!projectId || isExporting) {
            return;
        }

        setIsExporting(true);
        setExportedCount(0);

        const allItems = [];
        let beforeTx: string | undefined;
        let lastRequestTime = 0;

        try {
            while (true) {
                const now = Date.now();
                if (lastRequestTime) {
                    const elapsed = now - lastRequestTime;
                    if (elapsed < MIN_REQUEST_INTERVAL_MS) {
                        await delay(MIN_REQUEST_INTERVAL_MS - elapsed);
                    }
                }
                lastRequestTime = Date.now();

                const { data, error } = await getProjectBillingHistory({
                    path: { id: projectId },
                    query: { before_tx: beforeTx, limit: EXPORT_PAGE_SIZE }
                });

                if (error) {
                    throw error;
                }

                const currentPage = data.history;

                if (!currentPage.length) {
                    break;
                }

                const mappedPage = currentPage.map(mapDTOTransactionToBillingHistoryItem);
                allItems.push(...mappedPage);

                setExportedCount(prev => prev + currentPage.length);

                if (currentPage.length < EXPORT_PAGE_SIZE) {
                    break;
                }

                beforeTx = currentPage[currentPage.length - 1].id;
            }

            const csvContent = buildBillingHistoryCsv(allItems);
            const projectName = project?.name || 'unknown';
            const filename = buildBillingHistoryFilename(projectName, projectId);
            downloadCsvFile(csvContent, filename);

            if (isMountedRef.current) {
                toast({
                    title: 'Billing history exported',
                    status: 'success',
                    duration: 4000,
                    isClosable: true
                });
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            if (isMountedRef.current) {
                toast({
                    title: 'Failed to export billing history',
                    description: message,
                    status: 'error',
                    duration: 6000,
                    isClosable: true
                });
            }
        } finally {
            setIsExporting(false);
        }
    }, [projectId, isExporting, toast]);

    return {
        isExporting,
        exportedCount,
        exportFullHistory
    };
}
