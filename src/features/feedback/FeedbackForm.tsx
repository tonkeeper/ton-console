import { FC } from 'react';
import { chakra, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { FeedbackFromI } from './interfaces/form';
import { feetbackModalStore } from './model/feedback';
import { userStore } from 'src/shared/stores';
import { projectsStore } from 'src/shared/stores';

export const FeedbackFrom: FC<{
    formId: string;
}> = ({ formId }) => {
    const { handleSubmit, register } = useForm<FeedbackFromI>({
        defaultValues: {
            name: userStore.user$.value
                ? `${userStore.user$.value?.firstName} ${userStore.user$.value?.lastName}`
                : '',
            company: projectsStore.selectedProject?.name || '',
            tg: '',
            information: ''
        }
    });

    const submitMiddleware = async (form: FeedbackFromI): Promise<number> => {
        const response = await feetbackModalStore.sendForm(form);
        return response.status;
    };

    return (
        <chakra.form w="100%" onSubmit={handleSubmit(submitMiddleware)} noValidate id={formId}>
            <FormControl isRequired>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                    pr="60px"
                    autoComplete="off"
                    id="name"
                    placeholder="Your name"
                    type="name"
                    {...register('name')}
                />
            </FormControl>

            <FormControl isRequired>
                <FormLabel htmlFor="company">Company</FormLabel>
                <Input
                    pr="60px"
                    autoComplete="off"
                    id="company"
                    placeholder="Your company name"
                    {...register('company')}
                />
            </FormControl>

            <FormControl isRequired>
                <FormLabel htmlFor="tg">TG handle</FormLabel>
                <Input
                    autoComplete="off"
                    id="tg"
                    placeholder="Your telegram handle (like @handle)"
                    {...register('tg')}
                />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="information">Additional information</FormLabel>
                <Textarea
                    placeholder="Ton Console services you are looking for"
                    {...register('information')}
                />
            </FormControl>
        </chakra.form>
    );
};
