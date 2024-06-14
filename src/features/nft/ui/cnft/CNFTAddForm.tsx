import { FC } from 'react';
import {
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    StyleProps
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { isAddersValid, isNumber, mergeRefs, Span, tonMask } from 'src/shared';
import { useIMask } from 'react-imask';
import { cnftStore, IndexingCnftCollectionDataT } from '../../model/cnft.store';
import BigNumber from 'bignumber.js';

export const CNFTAddForm: FC<
    StyleProps & {
        id?: string;
        onSubmit: SubmitHandler<IndexingCnftCollectionDataT>;
    }
> = ({ id, onSubmit, ...rest }) => {
    const submitHandler = (form: IndexingCnftCollectionDataT): void => {
        onSubmit(form);
    };

    const {
        handleSubmit,
        register,
        watch,
        formState: { errors }
    } = useForm<IndexingCnftCollectionDataT>({});

    const inputCount = watch('count');
    const pricePerNFT = cnftStore.pricePerNFT;
    const canCalculatePrice =
        pricePerNFT && isNumber(inputCount) && Number(inputCount) && Number(inputCount) >= 0.01;

    const price = canCalculatePrice
        ? new BigNumber(Number(inputCount)).multipliedBy(pricePerNFT).dividedBy(1e9)
        : undefined;

    const { ref: maskRef } = useIMask({
        ...tonMask,
        min: 0
    });

    const { ref: hookFormRef, ...registerAmountRest } = register('count', {
        required: 'This is required',
        validate: value => {
            if (!value) {
                return 'Amount should be greater than 1';
            }
        },
        valueAsNumber: true
    });

    return (
        <chakra.form id={id} w="100%" onSubmit={handleSubmit(submitHandler)} noValidate {...rest}>
            <FormControl isInvalid={!!errors.account} isRequired>
                <FormLabel htmlFor="address">Address</FormLabel>
                <Input
                    autoComplete="off"
                    id="address"
                    {...register('account', {
                        required: 'This is required',
                        validate: value => {
                            if (!isAddersValid(value, { acceptTestnet: true, acceptRaw: true })) {
                                return 'Wrong address';
                            }
                        }
                    })}
                />
                <FormErrorMessage pos="static">
                    {errors.account && errors.account.message}
                </FormErrorMessage>
            </FormControl>
            <FormControl mb="0" isInvalid={!!errors.count} isRequired>
                <FormLabel htmlFor="count">Amount</FormLabel>
                <InputGroup>
                    <Input
                        ref={mergeRefs(maskRef, hookFormRef)}
                        borderRightRadius={0}
                        autoComplete="off"
                        id="count"
                        {...registerAmountRest}
                    />
                    <InputRightElement justifyContent="start" w="50%" borderLeftWidth={1}>
                        <Span textStyle="body2" color="text.secondary" pl={4}>
                            Price: {price ? `${price.toString()} TON` : ''}
                        </Span>
                    </InputRightElement>
                </InputGroup>
                <FormErrorMessage pos="static">
                    {errors.count && errors.count.message}
                </FormErrorMessage>
            </FormControl>
        </chakra.form>
    );
};
