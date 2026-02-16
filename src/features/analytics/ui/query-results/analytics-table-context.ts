import { createContext, useContext } from 'react';
import { AnalyticsTableSource } from '../../model';

export type AnalyticsTableContextType = {
    columnsWidths: number[];
    setColumnsWidths: (widths: number[] | ((widths: number[]) => number[])) => void;
    isResizingProcess: boolean;
    setIsResizingProcess: (v: boolean) => void;
    source: AnalyticsTableSource;
    setIColumnWidth: (i: number, width: number) => void;
};

export const AnalyticsTableContext = createContext<AnalyticsTableContextType | undefined>(
    undefined
);

export function useAnalyticsTableContext(): AnalyticsTableContextType {
    const context = useContext(AnalyticsTableContext);
    if (!context) {
        throw new Error('useAnalyticsTableContext must be used within AnalyticsTableProvider');
    }
    return context;
}
