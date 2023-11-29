import { createContext } from 'react';

export const TextareaGroupContext = createContext<{
    hasFooter: boolean;
    showScrollDivider: boolean;
    setShowScrollDivider: (value: boolean) => void;
    focused: boolean;
    setFocused: (value: boolean) => void;
}>({
    hasFooter: false,
    showScrollDivider: false,
    setShowScrollDivider: () => {},
    focused: false,
    setFocused: () => {}
});
