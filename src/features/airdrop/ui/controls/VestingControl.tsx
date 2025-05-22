import { RefCallback, useState } from 'react';
import {
    Button,
    FormControl,
    FormErrorMessage,
    HStack,
    IconButton,
    Input,
    Switch,
    Text,
    VStack
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, InputProps } from '@chakra-ui/icons';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { AirdropMetadata } from 'src/features/airdrop/model/interfaces/AirdropMetadata';
import { useIMask } from 'react-imask';
import { mergeRefs } from 'src/shared';

const formatDateTime = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const controlId = 'vesting';

interface ControlProps {
    context: UseFormReturn<AirdropMetadata>;
}

interface FractionInputProps {
    hookFractionRef: RefCallback<HTMLInputElement>;
    registerFractionRest: InputProps;
}

const FractionInput = ({ hookFractionRef, registerFractionRest }: FractionInputProps) => {
    const { ref: maskFractionRef } = useIMask({
        mask: Number,
        scale: 2,
        radix: '.'
    });

    return (
        <Input
            ref={mergeRefs(maskFractionRef, hookFractionRef)}
            autoComplete="off"
            placeholder="Fraction"
            {...registerFractionRest}
        />
    );
};

const Control = ({
    context: {
        register,
        formState: { errors, isSubmitted },
        control,
        watch
    }
}: ControlProps) => {
    const [isVestingEnabled, setIsVestingEnabled] = useState(false);
    const fieldErrors = errors[controlId];
    const vestingFields = watch(controlId) || [];

    const showErrors = isSubmitted;

    const { fields, append, remove } = useFieldArray({
        control,
        name: controlId
    });

    const validateUnlockTime = (index: number, value?: string) => {
        if (!value) return false;

        const currentDate = new Date(value);
        const today = new Date();

        if (currentDate < today) return false;

        if (index === 0) return true;

        const unlockTime = vestingFields[index - 1].unlockTime;
        const previousDate = unlockTime ? new Date(unlockTime) : undefined;
        return previousDate ? currentDate > previousDate : true;
    };

    const validateFraction = (index: number, value: number) => {
        const totalFraction = vestingFields.reduce((sum, field, i) => {
            if (i === index) return sum + value;
            return sum + (Number(field.fraction) || 0);
        }, 0);
        const invalid = vestingFields.some(i => Number(i.fraction || 0) <= 0);
        return totalFraction === 100 && !invalid;
    };

    const getErrorState = () => {
        const dateError = vestingFields.some((f, i) => !validateUnlockTime(i, f?.unlockTime));
        const fractionError = vestingFields.some(
            (f, i) => !validateFraction(i, Number(f?.fraction))
        );
        const hasZeroFraction = vestingFields.some(i => Number(i.fraction || 0) <= 0);
        return dateError && fractionError
            ? 'date-fraction'
            : dateError
            ? 'date'
            : hasZeroFraction
            ? 'zero'
            : fractionError
            ? 'fraction'
            : 'valid';
    };

    return (
        <>
            <Switch
                textStyle="label2"
                alignItems="center"
                alignSelf="flex-start"
                display="flex"
                isChecked={isVestingEnabled}
                onChange={e => {
                    setIsVestingEnabled(e.target.checked);
                    if (!e.target.checked) {
                        remove();
                    } else {
                        append([{}, {}]);
                    }
                }}
            >
                Enable Vesting
            </Switch>
            {isVestingEnabled && (
                <FormControl mb={0} isInvalid={showErrors && !!fieldErrors} isRequired>
                    <VStack alignItems="stretch" spacing={2}>
                        <HStack spacing={4}>
                            <Text textStyle="label2" w={213}>
                                Unlock Date
                            </Text>
                            <Text textStyle="label2" w={213}>
                                Percent
                            </Text>
                        </HStack>
                        <VStack align="stretch" spacing={4}>
                            {fields.map((field, index) => (
                                <VStack key={field.id} align="stretch">
                                    <HStack spacing={4}>
                                        <FormControl
                                            mb={0}
                                            isInvalid={
                                                showErrors &&
                                                !validateUnlockTime(
                                                    index,
                                                    vestingFields[index]?.unlockTime
                                                )
                                            }
                                        >
                                            <Input
                                                max={formatDateTime(
                                                    new Date(
                                                        Date.now() + 1000 * 60 * 60 * 24 * 365 * 5
                                                    )
                                                )}
                                                min={formatDateTime()}
                                                type="datetime-local"
                                                {...register(`${controlId}.${index}.unlockTime`, {
                                                    required: 'Time is required',
                                                    validate: value =>
                                                        validateUnlockTime(index, value)
                                                })}
                                            />
                                        </FormControl>
                                        <FormControl
                                            mb={0}
                                            isInvalid={
                                                showErrors &&
                                                !validateFraction(
                                                    index,
                                                    Number(vestingFields[index]?.fraction)
                                                )
                                            }
                                        >
                                            {(() => {
                                                const {
                                                    ref: hookFractionRef,
                                                    ...registerFractionRest
                                                } = register(`${controlId}.${index}.fraction`, {
                                                    required: 'Fraction is required',
                                                    validate: value =>
                                                        validateFraction(index, Number(value))
                                                });

                                                return (
                                                    <FractionInput
                                                        hookFractionRef={hookFractionRef}
                                                        registerFractionRest={registerFractionRest}
                                                    />
                                                );
                                            })()}
                                        </FormControl>

                                        <IconButton
                                            w="44px"
                                            minW="44px"
                                            maxW="44px"
                                            aria-label="Remove vesting period"
                                            icon={<DeleteIcon />}
                                            isDisabled={fields.length === 1}
                                            onClick={() => remove(index)}
                                            variant="secondary"
                                        />
                                    </HStack>
                                </VStack>
                            ))}
                            {showErrors && getErrorState() !== 'valid' && (
                                <FormControl mb={0} isInvalid={getErrorState() !== 'valid'}>
                                    <FormErrorMessage pos="static">
                                        {getErrorState() === 'date-fraction' &&
                                            'New date must be later than the previous one and date must be no earlier than tomorrow and percentages must sum up to 100'}
                                        {getErrorState() === 'zero' &&
                                            'Percentage value must be greater than zero.'}
                                        {getErrorState() === 'date' &&
                                            'New date must be later than the previous one and date must be no earlier than tomorrow'}
                                        {getErrorState() === 'fraction' &&
                                            'Percentages must sum up to 100'}
                                    </FormErrorMessage>
                                </FormControl>
                            )}
                            <Button
                                alignSelf="flex-start"
                                leftIcon={<AddIcon />}
                                onClick={() => append({})}
                                variant="secondary"
                            >
                                Add unlock date
                            </Button>
                        </VStack>
                    </VStack>
                </FormControl>
            )}
        </>
    );
};

export default Control;
