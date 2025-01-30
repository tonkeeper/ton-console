import { ADAirdropData, ADDistributorData } from 'src/shared/api/airdrop-api';
import { tonapiClient } from 'src/shared';
import { Address } from '@ton/core';

export type StatusT =
    | 'waiting'
    | 'deploy'
    | 'topup'
    | 'ready'
    | 'block'
    | 'withdraw_jetton'
    | 'withdraw_ton'
    | 'withdraw_complete';

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
        try {
            const res = await tonapiClient.accounts.getAccountJettonBalance(
                Address.parse(v.admin),
                Address.parse(v.jetton)
            );
            if (res?.balance < BigInt(v?.needJetton || 0)) {
                v.errCb({ title: 'Not enough tokens', text: 'Top up balance and try again' });
                return false;
            }
        } catch (err) {
            v.errCb({ title: 'Error', text: (err as { message?: string })?.message || '' });
            return false;
        }
    }

    return true;
};

export const getStatus = (distributors: ADDistributorData[]): StatusT => {
    const s: StatusT = 'waiting';

    if (distributors.length === 0) {
        return s;
    }
    const needDeploy = distributors.some(i => i.airdrop_status === 'not_deployed');
    const needTopUp = distributors.some(i => i.airdrop_status === 'lack_of_jettons');
    const ready = distributors.some(i => i.airdrop_status === 'ready');
    const isBlock = distributors.some(i => i.airdrop_status === 'blocked');
    const canWithdrawTons = distributors.some(i => !!i.ton_withdrawal_message);
    const canWithdrawJettons = distributors.some(i => !!i.jetton_withdrawal_message);
    const isWithdrawComplete = distributors.some(
        i => !i.jetton_withdrawal_message && !i.ton_withdrawal_message
    );

    if (needDeploy) {
        return 'deploy';
    }
    if (needTopUp) {
        return 'topup';
    }
    if (ready) {
        return 'ready';
    }
    if (isBlock && canWithdrawJettons) {
        return 'withdraw_jetton';
    }
    if (isBlock && canWithdrawTons) {
        return 'withdraw_ton';
    }
    if (isBlock && isWithdrawComplete) {
        return 'withdraw_complete';
    }
    if (isBlock) {
        return 'block';
    }

    return s;
};

export const getAmount = (
    distributors: ADDistributorData[],
    status: StatusT
): { ton: number; jetton?: number } | null => {
    if (status === 'deploy') {
        return {
            ton: distributors
                .filter(i => i.airdrop_status === 'not_deployed')
                .reduce((a, c) => a + parseFloat(c.deploy_message!.amount), 0)
        };
    }

    if (status === 'topup') {
        return {
            ton: distributors
                .filter(i => i.airdrop_status === 'lack_of_jettons' && !!i?.top_up_message)
                .reduce((a, c) => a + parseFloat(c?.top_up_message?.amount || '0'), 0),
            jetton: distributors
                .filter(i => i.airdrop_status === 'lack_of_jettons')
                .reduce((a, c) => a + parseFloat(c?.need_jettons || '0'), 0)
        };
    }
    if (status === 'ready') {
        return {
            ton: distributors
                .filter(i => i.airdrop_status === 'ready')
                .reduce((a, c) => a + parseFloat(c.block_message!.amount), 0)
        };
    }
    if (status === 'withdraw_jetton') {
        return {
            ton: distributors
                .filter(i => i.airdrop_status === 'blocked' && !!i.jetton_withdrawal_message)
                .reduce((a, c) => a + parseFloat(c.jetton_withdrawal_message!.amount), 0)
        };
    }
    if (status === 'withdraw_ton') {
        return {
            ton: distributors
                .filter(i => i.airdrop_status === 'blocked' && !!i.ton_withdrawal_message)
                .reduce((a, c) => a + parseFloat(c.ton_withdrawal_message!.amount), 0)
        };
    }
    return null;
};

type MessageT = {
    address: string;
    amount: string;
    stateInit?: string;
    payload?: string;
};

export const getMessages = (distributors: ADDistributorData[], status: StatusT) => {
    const messages: MessageT[] = [];

    if (status === 'deploy') {
        return distributors
            .filter(i => i.airdrop_status === 'not_deployed')
            .map(i => ({
                address: i.deploy_message!.address,
                amount: i.deploy_message!.amount,
                stateInit: i.deploy_message!.state_init,
                payload: i.deploy_message!.payload
            }));
    }

    if (status === 'topup') {
        return distributors
            .filter(i => i.airdrop_status === 'lack_of_jettons' && !!i?.top_up_message)
            .map(i => ({
                address: i.top_up_message!.address,
                amount: i.top_up_message!.amount,
                payload: i.top_up_message!.payload
            }));
    }

    if (status === 'ready') {
        return distributors
            .filter(i => i.airdrop_status === 'ready')
            .map(i => ({
                address: i.block_message!.address,
                amount: i.block_message!.amount,
                payload: i.block_message!.payload
            }));
    }

    if (status === 'withdraw_jetton') {
        return distributors
            .filter(i => i.airdrop_status === 'blocked' && !!i.jetton_withdrawal_message)
            .map(i => ({
                address: i.jetton_withdrawal_message!.address,
                amount: i.jetton_withdrawal_message!.amount,
                payload: i.jetton_withdrawal_message!.payload
            }));
    }

    if (status === 'withdraw_ton') {
        return distributors
            .filter(i => i.airdrop_status === 'blocked' && !!i.ton_withdrawal_message)
            .map(i => ({
                address: i.ton_withdrawal_message!.address,
                amount: i.ton_withdrawal_message!.amount,
                payload: i.ton_withdrawal_message!.payload
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

    if (
        distStatus === 'block' ||
        distStatus === 'withdraw_ton' ||
        distStatus === 'withdraw_jetton' ||
        distStatus === 'withdraw_complete'
    ) {
        status = 'blocked';
    }

    return status;
};

export const prettifyAmount = (v: number | string) => {
    const value = parseFloat(`${v}`);
    return new Intl.NumberFormat('en', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 10
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
