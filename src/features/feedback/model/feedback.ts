import { makeAutoObservable } from 'mobx';
import { apiClient, createAsyncAction } from 'src/shared';
import { createStandaloneToast } from '@chakra-ui/react';
import { projectsStore, userStore } from 'src/entities';
import type { AxiosError } from 'axios';
import { FeedbackFromI } from '../interfaces/form';

interface FeetbackMeta {
    source?: string;
}

class FeetbackStore {
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
        async (form: FeedbackFromI) => {
            const res = await apiClient.api.feedback({
                ...form,
                x_source: this.params?.source as string,
                x_project_id: projectsStore.selectedProject?.id.toString() as string,
                x_project_name: projectsStore.selectedProject?.name as string,
                x_tg_user_id: userStore.user$.value?.id.toString() as string,
                x_tg_user_name: userStore.user$.value
                    ? `${userStore.user$.value?.firstName} ${userStore.user$.value?.lastName}`
                    : ''
            });

            const { toast } = createStandaloneToast();
            toast({
                title: 'Your request has been sent, we will contact you shortly',
                status: 'success',
                isClosable: true
            });

            this.close();

            return res;
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
