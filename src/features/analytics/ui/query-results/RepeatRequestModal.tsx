import { FunctionComponent, useId, useLayoutEffect, useRef, useState } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
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
    Portal
} from '@chakra-ui/react';
import { ArrowIcon, H4, MenuButtonDefault, toBinaryRadio } from 'src/shared';
import { Controller, useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';

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

const RepeatRequestModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const formId = useId();
    const [selectedInterval, setSelectedInterval] = useState<TimeInterval>('day');
    const {
        handleSubmit,
        control,
        watch,
        register,
        formState: { errors }
    } = useForm<{
        repeat: boolean;
        frequency: number;
    }>();
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);
    const [pr, setPr] = useState(20);

    const repeatValue = watch('repeat');

    useLayoutEffect(() => {
        if (menuButtonRef.current) {
            setPr(menuButtonRef.current?.clientWidth);
        }
    }, []);

    const onSubmit = (form: { repeat: boolean; frequency: number }) => {
        if (form.repeat) {
            const frequency = form.frequency * intervalSecondsMultiplier[selectedInterval];
            console.log(true, frequency);
        } else {
            console.log(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>
                    <H4>Repeat Request</H4>
                </ModalHeader>
                <ModalBody py="0">
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
                        <FormControl mb="3" pl="6" isInvalid={!!errors.frequency} isRequired>
                            <InputGroup w="200px">
                                <Input
                                    pr={pr + 'px'}
                                    isDisabled={!repeatValue}
                                    placeholder="1"
                                    type="number"
                                    {...register('frequency', {
                                        required: true
                                    })}
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
                                                            setSelectedInterval(
                                                                interval as TimeInterval
                                                            );
                                                            setTimeout(() => {
                                                                if (menuButtonRef.current) {
                                                                    setPr(
                                                                        menuButtonRef.current
                                                                            ?.clientWidth
                                                                    );
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
                        </FormControl>
                    </chakra.form>
                </ModalBody>
                <ModalFooter gap="3">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isLoading={false}
                        type="submit"
                        variant="primary"
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(RepeatRequestModal);
