import { useQuery } from '@tanstack/react-query';
import { getInvoicesApp, DTOInvoicesApp } from 'src/shared/api';
import { useProjectId } from 'src/shared/contexts/ProjectContext';
import { InvoicesApp } from './interfaces';
import { TonAddress } from 'src/shared';

/**
 * Map DTO to domain model for InvoicesApp
 */
function mapInvoicesAppDTOToInvoicesApp(invoicesAppDTO: DTOInvoicesApp): InvoicesApp {
    return {
        id: invoicesAppDTO.id,
        name: invoicesAppDTO.name,
        creationDate: new Date(invoicesAppDTO.date_create * 1000),
        receiverAddress: TonAddress.parse(invoicesAppDTO.recipient_address),
        webhooks: (invoicesAppDTO.webhooks || []).map(w => ({ id: w.id, value: w.webhook }))
    };
}

/**
 * Query key factory for invoices queries
 */
const invoicesKeys = {
    all: () => ['invoices'] as const,
    app: (projectId: number | null | undefined) =>
        [...invoicesKeys.all(), 'app', projectId] as const
};

/**
 * Hook to check if invoices app exists (for navigation purposes)
 * Used by aside.tsx for displaying invoices menu
 */
export function useInvoicesAppStatusQuery() {
    const projectId = useProjectId();

    return useQuery({
        queryKey: invoicesKeys.app(projectId),
        queryFn: async () => {
            if (!projectId) return null;
            const { data, error } = await getInvoicesApp({
                query: { project_id: projectId }
            });
            if (error || !data?.app) return null;
            return mapInvoicesAppDTOToInvoicesApp(data.app);
        },
        enabled: !!projectId,
        staleTime: 10 * 60 * 1000 // 10 minutes
    });
}
