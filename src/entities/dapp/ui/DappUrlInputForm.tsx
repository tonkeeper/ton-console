import {
   
    FC,
    useCallback,
    useEffect,
    useRef
    // useState
} from 'react';
import {
    Box,
    BoxProps,
    Button,
    chakra,
    Flex,
    FormControl,
    FormErrorMessage,
    // Input,
    Link,
    // Menu,
    // MenuButton,
    // MenuItem,
    // MenuList,
    Text
} from '@chakra-ui/react';
import {
    // ArrowIcon,
    AsyncInput,
    Span,
    // TickIcon,
    useAsyncValidator
} from 'src/shared';
import { ErrorOption, useForm } from 'react-hook-form';
import { CreateDappForm, DAPPS_LINKS } from '../model';

type AppUrlFormStruct = {
    manifest: string;
    url: string;
};

const inputsLabels = {
    manifest: 'TonConnect Manifest URL'
    // url: 'App URL'
};

export const DAppUrlInputForm: FC<
    Omit<BoxProps, 'onSubmit'> & {
        onSubmit: (dappForm: CreateDappForm) => void | Promise<void>;
        submitButtonLoading: boolean;
        validator: (
            val: string
        ) => Promise<ErrorOption | undefined | { success: true; result: CreateDappForm }>;
    }
> = ({ onSubmit, validator, submitButtonLoading, ...rest }) => {
    // const [selectedInput, setSelectedInput] = useState<'manifest' | 'url'>('manifest');
    const methods = useForm<AppUrlFormStruct>({
        mode: 'onChange'
    });

    const {
        handleSubmit,
        register,
        // unregister,
        // trigger,
        getFieldState,
        formState: { errors, isDirty, isValid }
    } = methods;
    const [validationState, validationProduct] = useAsyncValidator(methods, 'manifest', validator);
    const isValidating = validationState !== 'succeed';
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

    // useEffect(() => {
    //     const notSelectedInput = selectedInput === 'manifest' ? 'url' : 'manifest';
    //     unregister(notSelectedInput);

    //     const selectedInputTouched =
    //         selectedInput === 'manifest' ? isManifestTouchedRef : isUrlTouchedRef;
    //     if (selectedInputTouched.current) {
    //         trigger(selectedInput);
    //     }
    // }, [register, unregister, selectedInput]);

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
                Registration
            </Text>
            <Flex align="center" justify="space-between">
                <Text textStyle="label2" mr="2" color="text.primary">
                    {inputsLabels.manifest}
                </Text>
                {/* <Menu gutter={2} placement="bottom-start">
                    <Text textStyle="label2" mr="2" color="text.primary">
                        {inputsLabels.manifest}
                    </Text> */}
                {/* <MenuButton
                        as={Button}
                        mb="1"
                        pl="0"
                        _hover={{ transform: 'unset' }}
                        _active={{ transform: 'unset' }}
                        rightIcon={<ArrowIcon />}
                        variant="flat"
                    >
                        {inputsLabels.manifest}
                    </MenuButton> */}
                {/* <MenuList zIndex={100} minW="100px">
                        {(Object.keys(inputsLabels) as ('manifest' | 'url')[]).map(key => (
                            <MenuItem key={key} onClick={() => setSelectedInput(key)}>
                                <Text textStyle="label2" mr="2" color="text.primary" noOfLines={1}>
                                    {inputsLabels[key]}
                                </Text>
                                {selectedInput === key && <TickIcon ml="auto" />}
                            </MenuItem>
                        ))}
                    </MenuList> */}
                {/* </Menu> */}
                <Link
                    textStyle="label2"
                    color="text.accent"
                    href={DAPPS_LINKS.APP_URL_DOCUMENTATION}
                    isExternal
                >
                    Documentation
                </Link>
            </Flex>
            <chakra.form noValidate onSubmit={handleSubmit(submitMiddleware)}>
                <FormControl
                    // display={selectedInput === 'manifest' ? 'block' : 'none'}
                    mb="5"
                    isInvalid={!!errors.manifest}
                >
                    <AsyncInput
                        autoComplete="off"
                        placeholder="https://yourapp.com/tonconnect-manifest.json"
                        validationState={validationState}
                        {...register('manifest', {
                            required: 'Required',
                            pattern: {
                                value: /^https?:\/\/.+/,
                                message: 'Wrong URL format'
                            }
                        })}
                    />
                    <FormErrorMessage>
                        {errors.manifest && errors.manifest.message}
                    </FormErrorMessage>
                </FormControl>
                {/* <FormControl
                    display={selectedInput === 'url' ? 'block' : 'none'}
                    mb="5"
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
                </FormControl> */}
                {!!validationProduct?.url && (
                    <Text textStyle="body2" mb="4" color="text.secondary">
                        App url
                        <Span textStyle="body2" fontFamily="mono" color="text.primary" ml="4">
                            {validationProduct?.url}
                        </Span>
                    </Text>
                )}
                <Button
                    isDisabled={!isDirty || !isValid || isValidating}
                    isLoading={submitButtonLoading}
                    type="submit"
                >
                    Register
                </Button>
            </chakra.form>
        </Box>
    );
};
