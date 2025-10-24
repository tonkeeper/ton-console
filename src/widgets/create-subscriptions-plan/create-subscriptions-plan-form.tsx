import { useForm } from 'react-hook-form';
import { FC } from 'react';
import { Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { ImageInput } from 'src/shared';

export const CreateSubscriptionsPlanForm: FC = () => {
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm();

    const onSubmit = (values: unknown): void => {
        console.debug(values);
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

            <FormControl>
                <FormLabel htmlFor="description">Description</FormLabel>
                <Input
                    autoComplete="off"
                    id="description"
                    placeholder="Description"
                    {...register('description')}
                />
            </FormControl>
            <FormControl isInvalid={!!errors.image} isRequired>
                <FormLabel htmlFor="image">Image</FormLabel>
                <ImageInput {...register('image', { required: 'This is required' })} />
                <FormErrorMessage>
                    {!!errors.image && (errors.image.message as string)}
                </FormErrorMessage>
            </FormControl>

            <Button mt={4} type="submit">
                Submit
            </Button>
        </form>
    );
};
