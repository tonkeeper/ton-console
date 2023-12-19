import { FunctionComponent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    chakra,
    FormControl,
    RadioGroup,
    Radio,
    Box,
    InputGroup,
    Input,
    InputRightElement,
    Menu,
    MenuList,
    MenuItem,
    Portal,
    FormErrorMessage
} from '@chakra-ui/react';
import { ArrowIcon, isNumber, MenuButtonDefault, mergeRefs, toBinaryRadio } from 'src/shared';
import { Controller, useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { AnalyticsQuery, analyticsQueryStore } from '../../model';
import { useIMask } from 'react-imask';

type TimeInterval = 'day' | 'hour' | 'minute';

const intervalLabels: Record<TimeInterval, string> = {
    day: 'Days',
    hour: 'Hours',
    minute: 'Minutes'
};

const intervalSecondsMultiplier: Record<TimeInterval, number> = {
    day: 60 * 60 * 24,
    hour: 60 * 60,
    minute: 60
};

const RepeatRequestModalContent: FunctionComponent<{
    query: AnalyticsQuery;
    formId: string;
    onIsDirtyChange: (val: boolean) => void;
    onClose: () => void;
}> = ({ query, formId, onIsDirtyChange, onClose }) => {
    const [selectedInterval, setSelectedInterval] = useState<TimeInterval>(() => {
        if (!query.repeatFrequencyMs) {
            return 'day';
        }

        const repeatFrequencyS = query.repeatFrequencyMs / 1000;

        if (repeatFrequencyS % intervalSecondsMultiplier.day === 0) {
            return 'day';
        } else if (repeatFrequencyS % intervalSecondsMultiplier.hour === 0) {
            return 'hour';
        } else {
            return 'minute';
        }
    });
    const {
        handleSubmit,
        control,
        watch,
        register,
        unregister,
        formState: { errors },
        setFocus
    } = useForm<{
        repeat: boolean;
        frequency: number;
    }>({
        defaultValues: {
            repeat: !!query.repeatFrequencyMs,
            ...(!!query.repeatFrequencyMs && {
                frequency:
                    query.repeatFrequencyMs / (intervalSecondsMultiplier[selectedInterval] * 1000)
            })
        }
    });
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);
    const [pr, setPr] = useState(20);

    const repeatValue = watch('repeat');
    const frequency = watch('frequency');
    const frequencyMs = (frequency || 0) * intervalSecondsMultiplier[selectedInterval] * 1000;

    useLayoutEffect(() => {
        if (menuButtonRef.current) {
            setPr(menuButtonRef.current?.clientWidth);
        }
    }, []);

    useEffect(() => {
        if (!repeatValue) {
            unregister('frequency', { keepError: false });
        } else {
            setFocus('frequency');
        }
    }, [repeatValue, unregister, setFocus]);

    useEffect(() => {
        if (repeatValue && !!query.repeatFrequencyMs) {
            onIsDirtyChange(query.repeatFrequencyMs !== frequencyMs);
        } else {
            onIsDirtyChange(repeatValue !== !!query.repeatFrequencyMs);
        }
    }, [repeatValue, query.repeatFrequencyMs, onIsDirtyChange, frequencyMs]);

    const onSubmit = async (form: { repeat: boolean; frequency: number }) => {
        if (form.repeat) {
            const freq = form.frequency * intervalSecondsMultiplier[selectedInterval];
            await analyticsQueryStore.setRepeatOnQuery(freq);
        } else {
            await analyticsQueryStore.removeRepeatOnQuery();
        }
        onClose();
    };

    const { ref: maskRef } = useIMask({
        mask: Number,
        scale: 0,
        signed: false,
        thousandsSeparator: '',
        padFractionalZeros: false,
        normalizeZeros: true,
        radix: '.',
        mapToRadix: ['.', ','],
        min: 1
    });

    const { ref: hookFormRef, ...hookFormRest } = register('frequency', {
        required: repeatValue ? 'This field is required' : false,
        validate(value) {
            if (!repeatValue) {
                return;
            }

            if (!isNumber(value)) {
                return 'This field must be a number';
            }

            value = Number(value);

            if (value < 1 || !Number.isInteger(value)) {
                return 'This field must be a positive integer';
            }
        }
    });

    return (
        <chakra.form noValidate onSubmit={handleSubmit(onSubmit)} id={formId}>
            <FormControl mb="2" isRequired>
                <Controller
                    name="repeat"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            flexDir="column"
                            gap="1"
                            display="flex"
                            {...toBinaryRadio(field)}
                        >
                            <Radio py="2" value="false">
                                <Box textStyle="label2">Not repeated</Box>
                            </Radio>
                            <Radio py="2" value="true">
                                <Box textStyle="label2">Repeat every</Box>
                            </Radio>
                        </RadioGroup>
                    )}
                />
            </FormControl>
            <FormControl mb="5" pl="6" isInvalid={!!errors.frequency} isRequired>
                <InputGroup w="200px">
                    <Input
                        ref={mergeRefs(hookFormRef, maskRef)}
                        pr={pr + 'px'}
                        isDisabled={!repeatValue}
                        placeholder="1"
                        type="number"
                        {...hookFormRest}
                    />
                    <InputRightElement w="fit-content" pr="1px">
                        <Menu placement="bottom-end">
                            <MenuButtonDefault
                                isDisabled={!repeatValue}
                                py="10px"
                                h="10"
                                minH="10"
                                px="4"
                                rightIcon={<ArrowIcon />}
                                ref={menuButtonRef}
                            >
                                {intervalLabels[selectedInterval]}
                            </MenuButtonDefault>
                            <Portal>
                                <MenuList zIndex={10000}>
                                    {Object.keys(intervalLabels).map(interval => (
                                        <MenuItem
                                            key={interval}
                                            onClick={() => {
                                                setSelectedInterval(interval as TimeInterval);
                                                setTimeout(() => {
                                                    if (menuButtonRef.current) {
                                                        setPr(menuButtonRef.current?.clientWidth);
                                                    }
                                                });
                                            }}
                                        >
                                            {intervalLabels[interval as TimeInterval]}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Portal>
                        </Menu>
                    </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.frequency && errors.frequency.message}</FormErrorMessage>
            </FormControl>
        </chakra.form>
    );
};

export default observer(RepeatRequestModalContent);
