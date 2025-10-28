import { useMutation } from '@tanstack/react-query';
import { feedback, FeedbackResponse } from 'src/shared/api';
import { createStandaloneToast } from '@chakra-ui/react';
import { useProjectName } from 'src/shared/contexts/ProjectIdContext';
import { useProjectId } from 'src/shared/contexts/ProjectIdContext';
import { userStore } from 'src/shared/stores';
import type { AxiosError } from 'axios';
import { FeedbackFromI } from '../interfaces/form';

/**
 * Hook to send feedback form
 * @param source - Source of the feedback request (e.g., 'unlimited-tonapi', 'on-ramp')
 */
export function useSendFeedbackMutation(source?: string) {
    const projectId = useProjectId();
    const projectName = useProjectName();

    return useMutation({
        mutationFn: async (form: FeedbackFromI): Promise<FeedbackResponse> => {
            const { data, error } = await feedback({
                body: {
                    ...form,
                    x_source: source as string,
                    x_project_id: projectId?.toString() as string,
                    x_project_name: projectName as string,
                    x_tg_user_id: userStore.user$.value?.id.toString() as string,
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
        onError: (error) => {
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
