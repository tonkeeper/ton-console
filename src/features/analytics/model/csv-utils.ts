import { parse } from 'csv-parse/sync';
import { AnalyticsTableSource } from './interfaces';

export async function fetchCSV(url: string): Promise<AnalyticsTableSource> {
    const csvContent = await (await fetch(url)).text();
    const [headings, ...data] = parse(csvContent);

    return { headings, data };
}
