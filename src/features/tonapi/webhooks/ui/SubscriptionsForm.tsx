import { FC, useEffect } from 'react';
import { chakra, FormControl, FormLabel, Input, StyleProps } from '@chakra-ui/react';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { Address } from 'ton-core';
import { AddSubscriptionsForm } from '../model/interfaces/add-subscriptions-form';

export type SubscriptionsFormInternal = {
    // accounts: Address[];
    accounts: string;
};

export const SubscriptionsForm: FC<
    StyleProps & {
        id?: string;
        onSubmit: SubmitHandler<AddSubscriptionsForm>;
        disableDefaultFocus?: boolean;
    }
> = ({ id, onSubmit, disableDefaultFocus, ...rest }) => {
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
        formState: { errors }
    } = useFormContext<SubscriptionsFormInternal>();

    useEffect(() => {
        if (!disableDefaultFocus) {
            setFocus('accounts');
        }
    }, [disableDefaultFocus, setFocus]);

    return (
        <chakra.form id={id} w="100%" onSubmit={handleSubmit(submitHandler)} noValidate {...rest}>
            {/* <FormControl isInvalid={!!errors.initiations}>
                <FormLabel htmlFor="initiations">Initiations</FormLabel>
                <Controller
                    name="initiations"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup display="flex" flexDirection="column" {...toBinaryRadio(field)}>
                            <Radio
                                alignItems="flex-start"
                                mb="2"
                                isDisabled
                                variant="withDescription"
                            >
                                <Box textStyle="label2" mb="0.5">
                                    Finalized trace
                                </Box>
                            </Radio>
                            <Radio alignItems="flex-start" variant="withDescription" defaultChecked>
                                <Box textStyle="label2" mb="0.5">
                                    Transactions
                                </Box>
                            </Radio>
                        </RadioGroup>
                    )}
                />
            </FormControl> */}
            <FormControl isInvalid={!!errors.accounts} isRequired>
                <FormLabel htmlFor="accounts">Accounts</FormLabel>
                <Input
                    id="accounts"
                    placeholder="Accounts"
                    {...register('accounts', {
                        required: 'This is required'
                    })}
                />
            </FormControl>
        </chakra.form>
    );
};
