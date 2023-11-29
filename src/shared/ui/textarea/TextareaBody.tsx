import { ChangeEvent, ComponentProps, UIEvent, useContext, KeyboardEvent } from 'react';
import { forwardRef, Textarea } from '@chakra-ui/react';
import { TextareaGroupContext } from './textarea-group-context';

export const TextareaBody = forwardRef<ComponentProps<typeof Textarea>, typeof Textarea>(
    ({ onScroll, onFocus, onBlur, onChange, onKeyDown, ...props }, ref) => {
        const { hasFooter, setShowScrollDivider, setFocused } = useContext(TextareaGroupContext);

        const scrollHandler = (e: UIEvent<HTMLTextAreaElement>) => {
            onScroll?.(e);
            recalculateScroll(e.target as HTMLTextAreaElement);
        };

        const changeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
            onChange?.(e);
            recalculateScroll(e.target as HTMLTextAreaElement);
        };

        const recalculateScroll = (target: HTMLTextAreaElement) => {
            setShowScrollDivider(
                target.scrollHeight !== target.clientHeight &&
                    target.clientHeight + target.scrollTop !== target.scrollHeight
            );
        };

        const keyDownHandler = (e: KeyboardEvent<HTMLTextAreaElement>) => {
            onKeyDown?.(e);
            if ((e.key === 'Enter' && !e.shiftKey) || e.key === 'ArrowDown') {
                const textarea = e.target as HTMLTextAreaElement;
                setTimeout(() => {
                    if (
                        textarea.scrollHeight !== textarea.clientHeight &&
                        textarea.clientHeight + textarea.scrollTop + 10 >= textarea.scrollHeight
                    )
                        textarea.scrollTop = textarea.scrollHeight;
                });
            }
        };

        return (
            <Textarea
                ref={ref}
                onBlur={e => {
                    onBlur?.(e);
                    setFocused(false);
                }}
                onChange={changeHandler}
                onFocus={e => {
                    onFocus?.(e);
                    setFocused(true);
                }}
                onKeyDown={keyDownHandler}
                onScroll={scrollHandler}
                {...(hasFooter && { borderBottom: 'none !important;', borderBottomRadius: '0' })}
                {...props}
            />
        );
    }
);
