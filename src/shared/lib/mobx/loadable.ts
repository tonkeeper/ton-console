import { action, makeObservable, observable } from 'mobx';

export class Loadable<T> {
    defaultValue: T;

    value: T;

    isLoading = false;

    error: unknown = null;

    constructor(value: T) {
        this.defaultValue = value;
        this.value = value;

        makeObservable(this, {
            defaultValue: false,
            clear: action,
            isLoading: observable,
            error: observable,
            value: observable
        });
    }

    clear(value?: T): void {
        this.isLoading = false;
        this.error = null;
        this.value = value || this.defaultValue;
    }
}
