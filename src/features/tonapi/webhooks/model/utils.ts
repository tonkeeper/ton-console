import { RTWebhookListStatusEnum } from 'src/shared/api/streaming-api';
import { StatusIndicatorVariant } from 'src/shared/ui/StatusIndicator';

export function getWebhookStatusLabel(status: RTWebhookListStatusEnum): string {
    switch (status) {
        case RTWebhookListStatusEnum.RTOnline:
            return 'Online';
        case RTWebhookListStatusEnum.RTOffline:
            return 'Offline';
        case RTWebhookListStatusEnum.RTSuspended:
            return 'Suspended';
    }
}

export function getWebhookStatusVariant(status: RTWebhookListStatusEnum): StatusIndicatorVariant {
    switch (status) {
        case RTWebhookListStatusEnum.RTOnline:
            return 'success';
        case RTWebhookListStatusEnum.RTOffline:
        case RTWebhookListStatusEnum.RTSuspended:
            return 'error';
    }
}
