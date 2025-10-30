import { useMutation } from '@tanstack/react-query';
import { feedback, FeedbackResponse } from 'src/shared/api';
import { createStandaloneToast } from '@chakra-ui/react';
import { useMaybeProject } from 'src/shared/contexts/ProjectIdContext';
import { userStore } from 'src/shared/stores';
import type { AxiosError } from 'axios';
import { FeedbackFromI } from '../interfaces/form';

/**
 * Hook to send feedback form
 */
export function useSendFeedbackMutation() {
    const project = useMaybeProject();
    const projectId = project?.id;
    const projectName = project?.name;

    return useMutation({
        mutationFn: async (form: FeedbackFromI & { source: string }): Promise<FeedbackResponse> => {
            const { data, error } = await feedback({
                body: {
                    name: form.name,
                    tg: form.tg,
                    company: form.company,
                    information: form.information,
                    x_source: form.source,
                    x_project_id: projectId?.toString() ?? '',
                    x_project_name: projectName ?? '',
                    x_tg_user_id: userStore.user$.value?.id.toString() ?? '',
                    x_tg_user_name: userStore.user$.value
                        ? `${userStore.user$.value?.firstName} ${userStore.user$.value?.lastName}`
                        : ''
                }
            });

            if (error) throw error;

            return data;
        },
        onSuccess: () => {
            const { toast } = createStandaloneToast();
            toast({
                title: 'Your request has been sent, we will contact you shortly',
                status: 'success',
                isClosable: true,
                duration: 3000
            });
        },
        onError: error => {
            const { toast } = createStandaloneToast();
            let title = 'Unknown error';
            let description = 'Unknown api error happened. Try again later';

            if ((error as AxiosError<{ code: number }>)?.response?.data?.code === 3) {
                title = 'Only one request per minute is allowed';
                description = 'Please wait few minutes and try again';
            }

            toast({
                title,
                description,
                status: 'error',
                isClosable: true,
                duration: 3000
            });
        }
    });
}
