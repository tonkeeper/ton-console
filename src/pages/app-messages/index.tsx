import { FunctionComponent } from 'react';
import { AsyncInput, Overlay, useAsyncValidator } from 'src/shared';
import { Button, chakra, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { ErrorOption, useForm } from 'react-hook-form';

const validator = async (val: string): Promise<ErrorOption | undefined> => {
    await new Promise(r => setTimeout(r, 2000));
    if (val.includes('123')) {
        return;
    }

    return {
        message: 'Cannot parse manifest'
    };
};

const AppMessagesPage: FunctionComponent = () => {
    const methods = useForm<{
        manifestUrl: string;
    }>({
        mode: 'onChange'
    });

    const {
        handleSubmit,
        register,
        formState: { errors, isDirty, isValid }
    } = methods;
    const validationState = useAsyncValidator(methods, 'manifestUrl', validator);
    const isValidating = validationState !== 'succeed';

    const onSubmit = console.log;

    return (
        <Overlay>
            <chakra.form noValidate onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={!!errors.manifestUrl}>
                    <AsyncInput
                        autoComplete="off"
                        placeholder="Project name"
                        validationState={validationState}
                        {...register('manifestUrl', {
                            required: 'Required',
                            pattern: {
                                value: /^https?:\/\/.+/,
                                message: 'Wrong URL format'
                            }
                        })}
                    />
                    <FormErrorMessage>
                        {errors.manifestUrl && errors.manifestUrl.message}
                    </FormErrorMessage>
                </FormControl>
                <Button isDisabled={!isDirty || !isValid || isValidating}>ok</Button>
            </chakra.form>
        </Overlay>
    );
};

export default AppMessagesPage;
