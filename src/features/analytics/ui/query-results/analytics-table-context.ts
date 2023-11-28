import { createContext } from 'react';
import { AnalyticsTableSource } from '../../model';

type AnalyticsTableContextType = {
    columnsWidths: number[];
    setColumnsWidths: (widths: number[] | ((widths: number[]) => number[])) => void;
    isResizingProcess: boolean;
    setIsResizingProcess: (v: boolean) => void;
    source: AnalyticsTableSource;
    setIColumnWidth: (i: number, width: number) => void;
};

export const AnalyticsTableContext = createContext<AnalyticsTableContextType>(
    {} as unknown as AnalyticsTableContextType
);
