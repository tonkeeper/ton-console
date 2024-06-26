import { FC, useEffect } from 'react';
import {
    chakra,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    StyleProps
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
    AsyncInput,
    isAddersValid,
    isNumber,
    mergeRefs,
    Span,
    TonCurrencyAmount
} from 'src/shared';
import { useIMask } from 'react-imask';
import { cnftStore, IndexingCnftCollectionDataT } from '../../model/cnft.store';
import { observer } from 'mobx-react-lite';

const CNFTAddForm: FC<
    StyleProps & {
        id?: string;
        onSubmit: SubmitHandler<IndexingCnftCollectionDataT>;
    }
> = ({ id, onSubmit, ...rest }) => {
    const submitHandler = (form: IndexingCnftCollectionDataT): void => {
        onSubmit(form);
    };

    useEffect(() => {
        return () => {
            cnftStore.currentAddress$.clear();
        };
    }, []);

    const {
        handleSubmit,
        register,
        watch,
        formState: { errors }
    } = useForm<IndexingCnftCollectionDataT>({});

    const inputCount = watch('count');
    const pricePerNFT = cnftStore.pricePerNFT$.value;
    const canCalculatePrice =
        cnftStore.pricePerNFT$.isResolved &&
        inputCount > 0 &&
        isNumber(inputCount) &&
        inputCount >= 0.01;

    const priceString =
        canCalculatePrice && pricePerNFT
            ? TonCurrencyAmount.fromRelativeAmount(
                  pricePerNFT.amount.multipliedBy(inputCount)
              ).toStringCurrencyAmount({ decimalPlaces: 4 })
            : undefined;

    const { ref: maskRef } = useIMask({
        mask: Number,
        scale: 0,
        signed: false,
        normalizeZeros: true,
        radix: '.',
        mapToRadix: [','],
        min: 0,
        max: 1000000000
    });

    const { nft_count, paid_indexing_count } = cnftStore.currentAddress$.value ?? {};
    const currentAddressDataExists = nft_count !== undefined && paid_indexing_count !== undefined;
    const invalidHelpText =
        cnftStore.currentAddress$.error && !errors.account
            ? 'cNFT not exists for this address'
            : 'Please enter cNFT address';
    const availableNFTCount = currentAddressDataExists ? nft_count - paid_indexing_count : 0;
    const addressHelpText = currentAddressDataExists
        ? `Collection NFT count: ${nft_count}, Paid: ${paid_indexing_count}, Available: ${availableNFTCount}`
        : invalidHelpText;

    const { ref: hookFormRef, ...registerAmountRest } = register('count', {
        required: 'This is required',
        validate: value => {
            if (!value) {
                return 'Amount should be greater than 0';
            }

            if (currentAddressDataExists && value > availableNFTCount) {
                return 'Not enough avalible cNFT';
            }
        },
        valueAsNumber: true
    });

    return (
        <chakra.form id={id} w="100%" onSubmit={handleSubmit(submitHandler)} noValidate {...rest}>
            <FormControl isInvalid={!!errors.account} isRequired>
                <FormLabel htmlFor="address">Address</FormLabel>
                <AsyncInput
                    autoComplete="off"
                    autoFocus
                    id="address"
                    {...register('account', {
                        required: 'This is required',
                        validate: value => {
                            if (!isAddersValid(value, { acceptTestnet: true, acceptRaw: true })) {
                                return 'Wrong address';
                            }
                            if (cnftStore.currentAddress$.error) {
                                return 'cNFT not exists for this address';
                            }
                        },
                        onChange: e => cnftStore.checkCNFT(e.target.value)
                    })}
                />

                <FormHelperText>{addressHelpText}</FormHelperText>
                <FormErrorMessage pos="static">
                    {errors.account && errors.account.message}
                </FormErrorMessage>
            </FormControl>
            <FormControl mb="0" isInvalid={!!errors.count} isRequired>
                <FormLabel htmlFor="count">Amount</FormLabel>
                <InputGroup>
                    <Input
                        ref={mergeRefs(maskRef, hookFormRef)}
                        autoComplete="off"
                        id="count"
                        {...registerAmountRest}
                    />
                    <InputRightElement justifyContent="start" w="50%" borderLeftWidth={1}>
                        <Span textStyle="body2" color="text.secondary" pl={4}>
                            Price: {priceString}
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

export default observer(CNFTAddForm);
