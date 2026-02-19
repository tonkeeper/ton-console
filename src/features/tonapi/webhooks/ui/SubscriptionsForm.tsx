import { FC, useEffect } from 'react';
import {
    Box,
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Radio,
    RadioGroup,
    StyleProps
} from '@chakra-ui/react';
import { Controller, SubmitHandler, useFormContext } from 'react-hook-form';
import { Address } from '@ton/core';
import { AddSubscriptionsForm } from '../model/interfaces/add-subscriptions-form';
import { isValidAddress } from 'src/features/jetton/lib/utils';
import { Network, toBinaryRadio } from 'src/shared';

export type SubscriptionsFormInternal = {
    initiations: 'transaction' | 'finalizeTrace';
    accounts: string;
};

function validateAddressNetwork(address: string, network: Network): string | true {
    if (!Address.isFriendly(address)) return true;

    const { isTestOnly } = Address.parseFriendly(address);
    if (isTestOnly && network === Network.MAINNET) {
        return 'This is a testnet address, but you are on mainnet';
    }
    if (!isTestOnly && network === Network.TESTNET) {
        return 'This is a mainnet address, but you are on testnet';
    }
    return true;
}

export const SubscriptionsForm: FC<
    StyleProps & {
        id?: string;
        network: Network;
        onSubmit: SubmitHandler<AddSubscriptionsForm>;
        disableDefaultFocus?: boolean;
    }
> = ({ id, network, onSubmit, disableDefaultFocus, ...rest }) => {
    const submitHandler = (form: SubscriptionsFormInternal): void => {
        onSubmit({
            accounts: form.accounts
                .split(',')
                .map(a => a.trim())
                .map(a => Address.parse(a))
        });
    };

    const {
        handleSubmit,
        register,
        setFocus,
        control,
        formState: { errors }
    } = useFormContext<SubscriptionsFormInternal>();

    useEffect(() => {
        if (!disableDefaultFocus) {
            setFocus('accounts');
        }
    }, [disableDefaultFocus, setFocus]);

    return (
        <chakra.form id={id} w="100%" onSubmit={handleSubmit(submitHandler)} noValidate {...rest}>
            <FormControl isInvalid={!!errors.initiations}>
                <FormLabel htmlFor="initiations">Initiations</FormLabel>
                <Controller
                    name="initiations"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup flexDir="column" display="flex" {...toBinaryRadio(field)}>
                            <Radio
                                alignItems="flex-start"
                                mb="2"
                                isDisabled
                                variant="withDescription"
                            >
                                <Box textStyle="label2" mb="0.5">
                                    Finalized trace (will be available soon)
                                </Box>
                            </Radio>
                            <Radio alignItems="flex-start" defaultChecked variant="withDescription">
                                <Box textStyle="label2" mb="0.5">
                                    Transactions
                                </Box>
                            </Radio>
                        </RadioGroup>
                    )}
                />
            </FormControl>
            <FormControl isInvalid={!!errors.accounts} isRequired>
                <FormLabel htmlFor="accounts">Accounts</FormLabel>
                <Input
                    id="accounts"
                    placeholder="Accounts"
                    {...register('accounts', {
                        required: 'This is required',
                        validate(value) {
                            const accounts = value.split(',').map(a => a.trim());
                            if (accounts.some(a => !isValidAddress(a))) {
                                return 'Invalid account address';
                            }

                            for (const addr of accounts) {
                                const networkCheck = validateAddressNetwork(addr, network);
                                if (networkCheck !== true) {
                                    return networkCheck;
                                }
                            }

                            return true;
                        }
                    })}
                />
                <FormErrorMessage>{errors.accounts && errors.accounts.message}</FormErrorMessage>
            </FormControl>
        </chakra.form>
    );
};
