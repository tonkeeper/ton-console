import { useForm } from 'react-hook-form';
import { FunctionComponent } from 'react';
import { Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';

export const CreateSubscriptionsPlanForm: FunctionComponent = () => {
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm();

    console.log(errors);

    const onSubmit = (values: unknown): void => {
        alert(values);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormControl isInvalid={!!errors.name} isRequired>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                    autoComplete="off"
                    id="name"
                    placeholder="Subscription name"
                    {...register('name', {
                        required: 'This is required',
                        minLength: { value: 3, message: 'Minimum length should be 3' }
                    })}
                />
                <FormErrorMessage>
                    {!!errors.name && (errors.name.message as string)}
                </FormErrorMessage>
            </FormControl>
            <Button mt={4} type="submit">
                Submit
            </Button>
        </form>
    );
};
