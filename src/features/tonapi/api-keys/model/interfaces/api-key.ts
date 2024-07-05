export interface ApiKey {
    id: number;
    name: string;
    value: string;
    limitRps: number | null;
    origins?: string[];
    creationDate: Date;
}
