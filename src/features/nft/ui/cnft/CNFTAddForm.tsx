import { useCallback, useEffect, useState, forwardRef } from 'react';
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
    isAddressValid,
    isNumber,
    mergeRefs,
    Span,
    TonCurrencyAmount
} from 'src/shared';
import { useIMask } from 'react-imask';
import { useCNftConfig, useCNftAddressCheck, IndexingCnftCollectionDataT } from '../../model/queries';

const CNFTAddForm = forwardRef<
    HTMLFormElement,
    StyleProps & {
        id?: string;
        onSubmit: SubmitHandler<IndexingCnftCollectionDataT>;
    }
>(({ id, onSubmit, ...rest }, ref) => {
    const { data: pricePerNFT, isLoading: isPriceLoading } = useCNftConfig();
    const { mutate: checkCNft, data: checkedAddress, isPending: isCheckingAddress, error: checkError, reset: resetAddressCheck } = useCNftAddressCheck();
    const [addressCheckError, setAddressCheckError] = useState<string | null>(null);

    const submitHandler = (form: IndexingCnftCollectionDataT): void => {
        onSubmit(form);
    };

    const {
        handleSubmit,
        register,
        watch,
        formState: { errors }
    } = useForm<IndexingCnftCollectionDataT>({});

    // Update address check error state when check completes
    useEffect(() => {
        if (!isCheckingAddress) {
            if (checkError) {
                setAddressCheckError('Network error checking address');
            } else if (checkedAddress === null) {
                setAddressCheckError('cNFT not exists for this address');
            } else if (checkedAddress !== undefined) {
                // Only clear error if we have a valid result (not undefined, not null)
                setAddressCheckError(null);
            }
            // If checkedAddress is undefined, we haven't checked yet, so keep current error state
        }
    }, [isCheckingAddress, checkedAddress, checkError]);

    // Reset address check state when component unmounts or form resets
    useEffect(() => {
        return () => {
            resetAddressCheck();
        };
    }, [resetAddressCheck]);

    const inputCount = watch('count');
    const canCalculatePrice =
        !isPriceLoading &&
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

    const { nft_count, paid_indexing_count } = checkedAddress ?? {};
    const currentAddressDataExists = nft_count !== undefined && paid_indexing_count !== undefined;
    const invalidHelpText =
        addressCheckError && !errors.account
            ? addressCheckError
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

    const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        checkCNft(e.target.value);
    }, [checkCNft]);

    return (
        <chakra.form ref={ref} id={id} w="100%" onSubmit={handleSubmit(submitHandler)} noValidate {...rest}>
            <FormControl isInvalid={!!errors.account} isRequired>
                <FormLabel htmlFor="address">Address</FormLabel>
                <AsyncInput
                    autoComplete="off"
                    autoFocus
                    id="address"
                    {...register('account', {
                        required: 'This is required',
                        validate: value => {
                            if (!isAddressValid(value, { acceptRaw: true })) {
                                return 'Wrong address';
                            }
                            // Async validation happens in useEffect above
                        },
                        onChange: handleAddressChange
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
});

CNFTAddForm.displayName = 'CNFTAddForm';

export default CNFTAddForm;
