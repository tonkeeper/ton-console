import { BillingHistoryItem } from 'src/shared/hooks/useBillingHistoryQuery';

export const EXPORT_PAGE_SIZE = 500;
export const MIN_REQUEST_INTERVAL_MS = Math.ceil(1000 / 3);

const CSV_HEADERS = [
    'Transaction ID',
    'Created At (ISO)',
    'Type',
    'Reason',
    'Description',
    'Signed Amount',
    'Currency',
    'Metadata'
] as const;

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const escapeCsvValue = (value: string): string => {
    const stringValue = String(value ?? '');
    const escapedValue = stringValue.replace(/"/g, '""');
    return `"${escapedValue}"`;
};

export const serializeCsvRow = (row: string[]): string => row.map(escapeCsvValue).join(',');

export const formatBillingHistoryCsvRow = (item: BillingHistoryItem): string[] => {
    const amount = item.amount.toStringAmount({ decimalPlaces: null, thousandSeparators: false });
    const sign = item.type === 'charge' ? '-' : '+';
    const reason = item.info.reason ?? '';

    // Extract metadata without 'reason' field
    const { reason: _, ...metadata } = item.info as Record<string, unknown>;
    const metadataJson = Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : '';

    return [
        item.id,
        item.date.toISOString(),
        item.type,
        reason,
        item.description,
        `${sign}${amount}`,
        item.amount.stringCurrency,
        metadataJson
    ];
};

export const buildBillingHistoryCsv = (items: BillingHistoryItem[]): string => {
    const header = serializeCsvRow([...CSV_HEADERS]);
    const rows = items.map(item => serializeCsvRow(formatBillingHistoryCsvRow(item)));
    return [header, ...rows].join('\n');
};

export const buildBillingHistoryFilename = (projectName: string, projectId: number): string => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    return `ton-console-billing-history-${sanitizedProjectName}-${projectId}-${timestamp}.csv`;
};

export const downloadCsvFile = (content: string, filename: string): void => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
