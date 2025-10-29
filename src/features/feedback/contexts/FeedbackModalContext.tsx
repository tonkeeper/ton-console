import { createContext, useContext, ReactNode, FC, useState, useEffect } from 'react';

interface FeedbackModalContextType {
    isOpen: boolean;
    source: string | undefined;
    open: (source?: string) => void;
    close: () => void;
}

const FeedbackModalContext = createContext<FeedbackModalContextType | undefined>(undefined);

// Global ref to access modal methods from non-React components
let globalFeedbackModalRef: FeedbackModalContextType | null = null;

/**
 * Provider for managing feedback modal state
 */
export const FeedbackModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [source, setSource] = useState<string | undefined>(undefined);

    const open = (newSource?: string) => {
        setIsOpen(true);
        setSource(newSource);
    };

    const close = () => {
        setIsOpen(false);
        setSource(undefined);
    };

    const value: FeedbackModalContextType = { isOpen, source, open, close };

    // Store reference for global access from non-React components
    // Update whenever state changes
    useEffect(() => {
        globalFeedbackModalRef = value;
        // No cleanup: we want to keep the last valid reference
        // This prevents race conditions where globalFeedbackModalRef becomes null
        // while an async callback is being executed
    }, [value]);

    return (
        <FeedbackModalContext.Provider value={value}>
            {children}
        </FeedbackModalContext.Provider>
    );
};

/**
 * Hook to use feedback modal context
 */
export function useFeedbackModal(): FeedbackModalContextType {
    const context = useContext(FeedbackModalContext);
    if (context === undefined) {
        throw new Error('useFeedbackModal must be used within FeedbackModalProvider');
    }
    return context;
}

/**
 * Global function to open feedback modal from non-React components
 * @param source - Source of the feedback request
 */
export function openFeedbackModal(source?: string) {
    return () => {
        if (globalFeedbackModalRef) {
            globalFeedbackModalRef.open(source);
        } else {
            console.error('FeedbackModalProvider not found in component tree');
        }
    };
}
