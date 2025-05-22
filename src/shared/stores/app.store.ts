import { makeAutoObservable } from 'mobx';
import { userStore, projectsStore } from './root.store';
import { awaitValueResolved } from 'src/shared';

export class AppStore {
    isInitialized = false;

    constructor() {
        makeAutoObservable(this);
        this.initialize();
    }

    private async initialize() {
        await awaitValueResolved(userStore.user$);

        if (userStore.user$.value) {
            await awaitValueResolved(projectsStore.projects$);
        }

        this.isInitialized = true;
    }
}

export const appStore = new AppStore();
