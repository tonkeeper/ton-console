import { makeAutoObservable } from 'mobx';
import { awaitValueResolved } from 'src/shared';
import { UserStore } from 'src/entities/user/model/user.store';

interface AppStoreDependencies {
    userStore: UserStore;
}

export class AppStore {
    isInitialized = false;

    constructor(dependencies: AppStoreDependencies) {
        makeAutoObservable(this);
        this.waitForInitialization(dependencies);
    }

    private async waitForInitialization({ userStore }: AppStoreDependencies) {
        await awaitValueResolved(userStore.user$);

        // Projects are now loaded via React Query (ProjectContext)
        // No need to wait for projects here
        this.isInitialized = true;
    }
}
