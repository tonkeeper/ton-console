import { DappStore } from 'src/entities/dapp/model/dapp.store';
import { projectsStore } from 'src/shared/stores';

export const dappStore = new DappStore(projectsStore);
