import { makeAutoObservable } from 'mobx';
import { createAsyncAction } from 'src/shared';
import { feedback, FeedbackResponse } from 'src/shared/api';
import { createStandaloneToast } from '@chakra-ui/react';
import { projectsStore, userStore } from 'src/shared/stores';
import type { AxiosError } from 'axios';
import { FeedbackFromI } from '../interfaces/form';

interface FeetbackMeta {
    source?: string;
}

export class FeetbackStore {
    params: FeetbackMeta | null = null;

    // isOpen = true;

    constructor() {
        makeAutoObservable(this);

        // createImmediateReaction(
        //     () => projectsStore.selectedProject,
        //     project => {
        //         if (project) {
        //             this.fetchTonSupplyAndRate();
        //         }
        //     }
        // );
    }

    open(params: FeetbackMeta) {
        this.params = params;
    }

    close() {
        this.params = null;
    }

    get isOpen() {
        return this.params !== null;
    }

    sendForm = createAsyncAction(
        async (form: FeedbackFromI): Promise<FeedbackResponse> => {
            const { data, error } = await feedback({
                body: {
                    ...form,
                    x_source: this.params?.source as string,
                    x_project_id: projectsStore.selectedProject?.id.toString() as string,
                    x_project_name: projectsStore.selectedProject?.name as string,
                    x_tg_user_id: userStore.user$.value?.id.toString() as string,
                    x_tg_user_name: userStore.user$.value
                        ? `${userStore.user$.value?.firstName} ${userStore.user$.value?.lastName}`
                        : ''
                }
            });

            if (error) throw error;

            const { toast } = createStandaloneToast();
            toast({
                title: 'Your request has been sent, we will contact you shortly',
                status: 'success',
                isClosable: true
            });

            this.close();

            return data;
        },
        e => {
            const { toast } = createStandaloneToast();
            let title = 'Unknown error';
            let description = 'Unknown api error happened. Try again later';

            if ((e as AxiosError<{ code: number }>)?.response?.data?.code === 3) {
                title = 'Only one request pre minute is allowed';
                description = 'Please wait few minutes and try again';
            }
            toast({
                title,
                description,
                status: 'error',
                isClosable: true
            });
        }
    );
}

export const feetbackModalStore = new FeetbackStore();

export const openFeedbackModal = (source?: string) => () => feetbackModalStore.open({ source });
