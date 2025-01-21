import { ADAirdropData, ADDistributorData } from 'src/shared/api/airdrop-api';
import { tonapiClient } from 'src/shared';
import { Address } from '@ton/core';

export type StatusT = 'waiting' | 'deploy' | 'topup' | 'ready' | 'block';

type AccountCheckT = {
    admin: string;
    jetton: string;
    needTon: number;
    needJetton?: number;
    errCb: (v: { title: string; text: string }) => void;
};

export const checkAccount = async (v: AccountCheckT) => {
    if (v.needTon) {
        const account = await tonapiClient.accounts.getAccount(Address.parse(v.admin));

        if (account.balance < BigInt(v.needTon)) {
            v.errCb({ title: 'Not enough TON', text: 'Top up balance and try again' });
            return false;
        }
    }

    if (v.needJetton) {
        const wallet = await tonapiClient.accounts.getAccountJettonBalance(
            Address.parse(v.admin),
            Address.parse(v.jetton)
        );

        if (wallet.balance < BigInt(v.needJetton)) {
            v.errCb({ title: 'Not enough tokens', text: 'Top up balance and try again' });
            return false;
        }
    }

    return true;
};

export const getStatus = (distributors: ADDistributorData[]) => {
    if (distributors.length === 0) {
        return 'waiting';
    }
    const needDeploy = distributors.findIndex(i => i.airdrop_status === 'not_deployed') !== -1;
    const needTopUp = distributors.findIndex(i => i.airdrop_status === 'lack_of_jettons') !== -1;
    const ready = distributors.findIndex(i => i.airdrop_status === 'ready') !== -1;
    const isBlock = distributors.findIndex(i => i.airdrop_status === 'blocked') !== -1;

    let s: StatusT = 'waiting';

    if (isBlock) {
        s = 'block';
    }
    if (ready) {
        s = 'ready';
    }
    if (needTopUp) {
        s = 'topup';
    }
    if (needDeploy) {
        s = 'deploy';
    }

    return s;
};

export const getAmount = (distributors: ADDistributorData[], status: StatusT) => {
    let amount: { ton: number; jetton?: number } = {
        ton: 0
    };
    if (status === 'deploy') {
        amount = {
            ton: distributors
                .filter(i => i.airdrop_status === 'not_deployed')
                .reduce((a, c) => a + parseFloat(c.deploy_message!.amount), 0)
        };
    }

    if (status === 'topup') {
        amount = {
            ton: distributors
                .filter(i => i.airdrop_status === 'lack_of_jettons')
                .reduce((a, c) => a + parseFloat(c.top_up_message!.amount), 0),
            jetton: distributors
                .filter(i => i.airdrop_status === 'lack_of_jettons')
                .reduce((a, c) => a + parseFloat(c.need_jettons!), 0)
        };
    }
    if (status === 'ready') {
        amount = {
            ton: distributors
                .filter(i => i.airdrop_status === 'ready')
                .reduce((a, c) => a + parseFloat(c.block_message!.amount), 0)
        };
    }

    return amount;
};

type MessageT = {
    address: string;
    amount: string;
    stateInit?: string;
    payload?: string;
};

export const getMessages = (distributors: ADDistributorData[], status: StatusT) => {
    let messages: MessageT[] = [];

    if (status === 'deploy') {
        messages = distributors
            .filter(i => i.airdrop_status === 'not_deployed')
            .map(i => ({
                address: i.deploy_message!.address,
                amount: i.deploy_message!.amount,
                stateInit: i.deploy_message!.state_init,
                payload: i.deploy_message!.payload
            }));
    }

    if (status === 'topup') {
        messages = distributors
            .filter(i => i.airdrop_status === 'lack_of_jettons')
            .map(i => ({
                address: i.top_up_message!.address,
                amount: i.top_up_message!.amount,
                payload: i.top_up_message!.payload
            }));
    }

    if (status === 'ready') {
        messages = distributors
            .filter(i => i.airdrop_status === 'ready')
            .map(i => ({
                address: i.top_up_message!.address,
                amount: i.top_up_message!.amount,
                payload: i.top_up_message!.payload
            }));
    }

    return messages;
};

export type AirdropStatusT =
    | 'need_file'
    | 'need_deploy'
    | 'claim_active'
    | 'claim_stopped'
    | 'blocked';

export const getAirdropStatus = (airdrop: ADAirdropData, distributors: ADDistributorData[]) => {
    const distStatus = getStatus(distributors);

    let status: AirdropStatusT = 'need_file';

    if (distStatus === 'waiting') {
        status = 'need_file';
    }

    if (distStatus === 'deploy' || distStatus === 'topup') {
        status = 'need_deploy';
    }

    if (distStatus === 'ready' && airdrop.clam_status === 'opened') {
        status = 'claim_active';
    }

    if (distStatus === 'ready' && airdrop.clam_status === 'closed') {
        status = 'claim_stopped';
    }

    if (distStatus === 'block') {
        status = 'blocked';
    }

    return status;
};

export const prettifyAmount = (v: number | string) => {
    const value = parseFloat(`${v}`);
    return new Intl.NumberFormat('en', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value);
};

export const sliceString = (str: string, length = 8) => {
    if (str.length / 2 < length) {
        return str;
    }

    const first = str.slice(0, length);
    const second = str.substring(str.length - length);

    return `${first}…${second}`;
};
