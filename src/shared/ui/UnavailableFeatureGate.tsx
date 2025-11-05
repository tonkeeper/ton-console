import { FC, ReactNode } from 'react';
import { Overlay } from './Overlay';
import { UnavailableFeature } from './UnavailableFeature';

interface UnavailableFeatureGateProps {
    /**
     * Whether the feature is available
     * If false, shows unavailable message in overlay on top of children
     */
    isAvailable: boolean;
    /**
     * Feature name for the unavailable message title
     */
    featureName: string;
    /**
     * Message shown to user (e.g., "Service is under maintenance", "Being updated", etc.)
     */
    message: string;
    /**
     * Optional link to documentation
     */
    docLink?: string;
    /**
     * Content to show when feature is available
     */
    children: ReactNode;
}

/**
 * Gate component that controls access to features
 *
 * When isAvailable=false, displays UnavailableFeature in Overlay on top of children.
 * When isAvailable=true, displays children in Overlay.
 *
 * Usage:
 * <UnavailableFeatureGate
 *   isAvailable={true}  // Change to false to disable feature
 *   featureName="Webhooks Playground"
 *   message="Service is under maintenance"
 * >
 *   <WebhooksPage />
 * </UnavailableFeatureGate>
 */
export const UnavailableFeatureGate: FC<UnavailableFeatureGateProps> = ({
    isAvailable,
    featureName,
    message,
    docLink,
    children
}) => {
    if (isAvailable) {
        return children;
    }
    return (
        <Overlay h="fit-content">
            <UnavailableFeature title={featureName} message={message} docLink={docLink} />
        </Overlay>
    );
};
