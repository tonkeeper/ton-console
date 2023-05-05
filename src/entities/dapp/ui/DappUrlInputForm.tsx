import { ComponentProps, FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    chakra,
    FormControl,
    FormErrorMessage,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text
} from '@chakra-ui/react';
import { ArrowIcon, AsyncInput, TickIcon, useAsyncValidator } from 'src/shared';
import { ErrorOption, useForm } from 'react-hook-form';
import { CreateDappForm } from '../model';

type AppUrlFormStruct = {
    manifest: string;
    url: string;
};

const inputsLabels = {
    manifest: 'TonConnect Manifest Url',
    url: 'Input dApp url directly'
};

export const DAppUrlInputForm: FunctionComponent<
    ComponentProps<typeof Box> & {
        onSubmit: (dappForm: CreateDappForm) => void;
        submitButtonLoading: boolean;
        validator: (
            val: string
        ) => Promise<ErrorOption | undefined | { success: true; result: CreateDappForm }>;
    }
> = ({ onSubmit, validator, submitButtonLoading, ...rest }) => {
    const [selectedInput, setSelectedInput] = useState<'manifest' | 'url'>('manifest');
    const methods = useForm<AppUrlFormStruct>({
        mode: 'onChange'
    });

    const {
        handleSubmit,
        register,
        unregister,
        trigger,
        getFieldState,
        formState: { errors, isDirty, isValid }
    } = methods;
    const [validationState, validationProduct] = useAsyncValidator(methods, 'manifest', validator);
    const isValidating = selectedInput === 'manifest' && validationState !== 'succeed';
    const { isTouched: isManifestTouched } = getFieldState('manifest');
    const { isTouched: isUrlTouched } = getFieldState('url');

    const isManifestTouchedRef = useRef(isManifestTouched);
    const isUrlTouchedRef = useRef(isUrlTouched);

    useEffect(() => {
        if (isManifestTouched) {
            isManifestTouchedRef.current = true;
        }
    }, [isManifestTouched]);

    useEffect(() => {
        if (isUrlTouched) {
            isUrlTouchedRef.current = true;
        }
    }, [isUrlTouched]);

    useEffect(() => {
        const notSelectedInput = selectedInput === 'manifest' ? 'url' : 'manifest';
        unregister(notSelectedInput);

        const selectedInputTouched =
            selectedInput === 'manifest' ? isManifestTouchedRef : isUrlTouchedRef;
        if (selectedInputTouched.current) {
            trigger(selectedInput);
        }
    }, [register, unregister, selectedInput]);

    const submitMiddleware = useCallback(
        (form: AppUrlFormStruct) => {
            if (form.url) {
                return onSubmit({ url: form.url });
            }

            if (validationProduct) {
                return onSubmit(validationProduct);
            }

            throw new Error('App url form error: appUrl is not specified as well as manifestUrl');
        },
        [validationProduct, onSubmit]
    );

    return (
        <Box {...rest}>
            <Text textStyle="label1" mb="6" color="text.primary">
                Register your app
            </Text>
            <Menu gutter={2} placement="bottom-start">
                <MenuButton
                    as={Button}
                    mb="1"
                    pl="0"
                    _hover={{ transform: 'unset' }}
                    _active={{ transform: 'unset' }}
                    rightIcon={<ArrowIcon />}
                    variant="flat"
                >
                    {inputsLabels[selectedInput]}
                </MenuButton>
                <MenuList zIndex={100} minW="100px">
                    {(Object.keys(inputsLabels) as ('manifest' | 'url')[]).map(key => (
                        <MenuItem key={key} onClick={() => setSelectedInput(key)}>
                            <Text textStyle="label2" mr="2" color="text.primary" noOfLines={1}>
                                {inputsLabels[key]}
                            </Text>
                            {selectedInput === key && <TickIcon ml="auto" />}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
            <chakra.form noValidate onSubmit={handleSubmit(submitMiddleware)}>
                <FormControl
                    display={selectedInput === 'manifest' ? 'block' : 'none'}
                    mb="6"
                    isInvalid={!!errors.manifest}
                >
                    <AsyncInput
                        autoComplete="off"
                        placeholder="https://yourapp.com/tonconnect-manifest.json"
                        validationState={validationState}
                        {...(selectedInput === 'manifest' &&
                            register('manifest', {
                                required: 'Required',
                                pattern: {
                                    value: /^https?:\/\/.+/,
                                    message: 'Wrong URL format'
                                }
                            }))}
                    />
                    <FormErrorMessage>
                        {errors.manifest && errors.manifest.message}
                    </FormErrorMessage>
                </FormControl>
                <FormControl
                    display={selectedInput === 'url' ? 'block' : 'none'}
                    mb="6"
                    isInvalid={!!errors.url}
                >
                    <Input
                        autoComplete="off"
                        placeholder="https://yourapp.com"
                        {...(selectedInput === 'url' &&
                            register('url', {
                                required: 'Required',
                                pattern: {
                                    value: /^https?:\/\/.+/,
                                    message: 'Wrong URL format'
                                }
                            }))}
                    />
                    <FormErrorMessage>{errors.url && errors.url.message}</FormErrorMessage>
                </FormControl>
                <Button
                    isDisabled={!isDirty || !isValid || isValidating}
                    isLoading={submitButtonLoading}
                    type="submit"
                >
                    Submit
                </Button>
            </chakra.form>
        </Box>
    );
};
