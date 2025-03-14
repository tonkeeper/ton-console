import { RefCallback, useState } from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Button,
    VStack,
    HStack,
    IconButton,
    Checkbox
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, InputProps } from '@chakra-ui/icons';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
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
        formState: { errors },
        control,
        watch
    }
}: ControlProps) => {
    const [isVestingEnabled, setIsVestingEnabled] = useState(false);
    const fieldErrors = errors[controlId];
    const vestingFields = watch(controlId) || [];

    const { fields, append, remove } = useFieldArray({
        control,
        name: controlId
    });

    const validateUnlockTime = (index: number, value: string) => {
        if (!value) return false;

        const currentDate = new Date(value);
        const today = new Date();

        if (currentDate < today) return false;

        if (index === 0) return true;

        const previousDate = new Date(vestingFields[index - 1].unlockTime);
        return currentDate >= previousDate;
    };

    const validateFraction = (index: number, value: number) => {
        const totalFraction = vestingFields.reduce((sum, field, i) => {
            if (i === index) return sum + value;
            return sum + (Number(field.fraction) || 0);
        }, 0);
        const invalid = vestingFields.some(i => Number(i.fraction || 0) <= 0);
        return totalFraction === 100 && !invalid;
    };

    return (
        <>
            <Checkbox
                alignSelf="flex-start"
                isChecked={isVestingEnabled}
                onChange={e => {
                    setIsVestingEnabled(e.target.checked);
                    if (!e.target.checked) {
                        remove();
                    } else {
                        append({
                            unlockTime: formatDateTime(new Date(Date.now() + 1000 * 60 * 60)),
                            fraction: 55
                        });
                    }
                }}
            >
                Enable Vesting
            </Checkbox>
            {isVestingEnabled && (
                <FormControl mb={0} isInvalid={!!fieldErrors} isRequired>
                    <FormLabel>Vesting Schedule</FormLabel>
                    <VStack align="stretch" spacing={4}>
                        {fields.map((field, index) => (
                            <VStack key={field.id} align="stretch">
                                <HStack spacing={4}>
                                    <FormControl
                                        mb={0}
                                        isInvalid={
                                            !!errors[
                                                `${controlId}.${index}.unlockTime` as keyof typeof errors
                                            ] ||
                                            !validateUnlockTime(
                                                index,
                                                vestingFields[index]?.unlockTime
                                            )
                                        }
                                    >
                                        <Input
                                            max={formatDateTime(
                                                new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 5)
                                            )}
                                            min={formatDateTime()}
                                            type="datetime-local"
                                            {...register(`${controlId}.${index}.unlockTime`, {
                                                required: 'Time is required',
                                                validate: value =>
                                                    validateUnlockTime(index, value) ||
                                                    'Date must be after the previous date'
                                            })}
                                        />
                                    </FormControl>
                                    <FormControl
                                        mb={0}
                                        isInvalid={
                                            !!errors[
                                                `${controlId}.${index}.fraction` as keyof typeof errors
                                            ] ||
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
                                                validate: value => {
                                                    return (
                                                        validateFraction(index, Number(value)) ||
                                                        'Total fractions cannot exceed 100%'
                                                    );
                                                }
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
                                        w={44}
                                        aria-label="Remove vesting period"
                                        icon={<DeleteIcon />}
                                        isDisabled={fields.length === 1}
                                        onClick={() => remove(index)}
                                    />
                                </HStack>
                                <FormControl
                                    mb={0}
                                    isInvalid={
                                        !!errors[
                                            `${controlId}.${index}.unlockTime` as keyof typeof errors
                                        ] ||
                                        !validateUnlockTime(
                                            index,
                                            vestingFields[index]?.unlockTime
                                        ) ||
                                        !!errors[
                                            `${controlId}.${index}.fraction` as keyof typeof errors
                                        ] ||
                                        !validateFraction(
                                            index,
                                            Number(vestingFields[index]?.fraction)
                                        )
                                    }
                                >
                                    {!validateUnlockTime(
                                        index,
                                        vestingFields[index]?.unlockTime
                                    ) && (
                                        <FormErrorMessage pos="static">
                                            Date must be after the previous date
                                        </FormErrorMessage>
                                    )}
                                    {!validateFraction(
                                        index,
                                        Number(vestingFields[index]?.fraction)
                                    ) && (
                                        <FormErrorMessage pos="static">
                                            Total fractions cannot exceed 100%
                                        </FormErrorMessage>
                                    )}
                                </FormControl>
                            </VStack>
                        ))}
                        <Button
                            leftIcon={<AddIcon />}
                            onClick={() =>
                                append({
                                    unlockTime: formatDateTime(
                                        new Date(Date.now() + 1000 * 60 * 60)
                                    ),
                                    fraction: 45
                                })
                            }
                        >
                            Add Vesting Period
                        </Button>
                    </VStack>
                </FormControl>
            )}
        </>
    );
};

export default Control;
