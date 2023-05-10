import { makeAutoObservable } from 'mobx';
import {
    apiClient,
    awaitValueResolved,
    createAsyncAction,
    createImmediateReaction,
    DTOCharge,
    DTOMessagesPackage,
    Loadable,
    notNull,
    TonCurrencyAmount,
    UsdCurrencyAmount
} from 'src/shared';
import { projectsStore } from 'src/entities';
import { AppMessagesPackage, AppMessagesPayment } from './interfaces';

class AppMessagesStore {
    packages$ = new Loadable<AppMessagesPackage[]>([]);

    balance$ = new Loadable<number>(0);

    paymentsHistory$ = new Loadable<AppMessagesPayment[]>([]);

    constructor() {
        makeAutoObservable(this);

        this.fetchPackages();

        createImmediateReaction(
            () => projectsStore.selectedProject,
            project => {
                this.clearState();

                if (project) {
                    this.fetchBalance();
                }
            }
        );
    }

    fetchPackages = this.packages$.createAsyncAction(async () => {
        const result = await apiClient.api.getMessagesPackages();
        return result.data.items.map(mapDTOPackageToAppmessagesPackage);
    });

    fetchBalance = this.balance$.createAsyncAction(async () => {
        const result = await apiClient.api.getMessagesBalance({
            project_id: projectsStore.selectedProject!.id
        });

        return result.data.balance;
    });

    buyPackage = createAsyncAction(async (packageId: AppMessagesPackage['id']) => {
        await apiClient.api.buyMessagesPackage(
            { project_id: projectsStore.selectedProject!.id },
            { id: packageId }
        );

        await this.fetchBalance();
    });

    fetchPaymentsHistory = this.paymentsHistory$.createAsyncAction(async () => {
        const packages = await awaitValueResolved(this.packages$);
        const history = await apiClient.api.getPushesPaymentsHistory({
            project_id: projectsStore.selectedProject!.id
        });

        return history.data.history
            .map(item => mapDTOChargeToAppmessagesPayment(packages, item))
            .filter(notNull);
    });

    clearState = (): void => {
        this.paymentsHistory$.clear();
        this.balance$.clear();
    };
}

function mapDTOPackageToAppmessagesPackage(dtoPackage: DTOMessagesPackage): AppMessagesPackage {
    return {
        messagesIncluded: dtoPackage.limits,
        price: new UsdCurrencyAmount(dtoPackage.usd_price),
        name: dtoPackage.name,
        id: dtoPackage.id
    };
}

function mapDTOChargeToAppmessagesPayment(
    packages: AppMessagesPackage[],
    dtoCharge: DTOCharge
): AppMessagesPayment | null {
    const boughtPackage = packages.find(item => item.id === dtoCharge.messages_package_id);

    if (!boughtPackage) {
        return null;
    }

    const tonAmount = new TonCurrencyAmount(dtoCharge.amount);

    return {
        id: dtoCharge.id,
        package: boughtPackage,
        date: new Date(dtoCharge.date_create),
        amount: tonAmount,
        amountUsdEquivalent: new UsdCurrencyAmount(
            tonAmount.amount.multipliedBy(dtoCharge.exchange_rate)
        )
    };
}

export const appMessagesStore = new AppMessagesStore();
