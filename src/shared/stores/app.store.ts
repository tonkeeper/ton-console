import { makeAutoObservable } from 'mobx';

export class AppStore {
    isInitialized = false;

    constructor() {
        makeAutoObservable(this);
        // App is initialized immediately
        // User and projects are now loaded via React Query
        this.isInitialized = true;
    }
}
