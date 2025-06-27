import { makeAutoObservable } from 'mobx';
import { awaitValueResolved } from 'src/shared';
import { ProjectsStore } from 'src/entities/project/model/projects.store';
import { UserStore } from 'src/entities/user/model/user.store';

interface AppStoreDependencies {
    userStore: UserStore;
    projectsStore: ProjectsStore;
}

export class AppStore {
    isInitialized = false;

    constructor(dependencies: AppStoreDependencies) {
        makeAutoObservable(this);
        this.waitForInitialization(dependencies);
    }

    private async waitForInitialization({ userStore, projectsStore }: AppStoreDependencies) {
        await awaitValueResolved(userStore.user$);

        if (userStore.user$.value) {
            await awaitValueResolved(projectsStore.projects$);
        }

        this.isInitialized = true;
    }
}
