import { ComponentProps, forwardRef } from 'react';
import { Input, InputGroup, InputRightElement, Spinner } from '@chakra-ui/react';
import { AsyncValidationState } from '../../hooks';
import { TickIcon } from '../icons';

export const AsyncInput = forwardRef<
    HTMLInputElement,
    ComponentProps<typeof Input> & {
        validationState: AsyncValidationState;
    }
>(({ validationState, ...rest }, ref) => {
    return (
        <InputGroup>
            <Input ref={ref} autoComplete="off" {...rest} />
            {validationState !== 'idle' && (
                <InputRightElement color="text.secondary">
                    {validationState === 'validating' ? (
                        <Spinner w="4" h="4" borderWidth="1px" />
                    ) : (
                        <TickIcon />
                    )}
                </InputRightElement>
            )}
        </InputGroup>
    );
});

AsyncInput.displayName = 'AsyncInput';
