import { FC } from 'react';
import {
    Box,
    BoxProps,
    Button,
    chakra,
    Checkbox,
    Flex,
    FormControl,
    FormErrorMessage,
    useDisclosure
} from '@chakra-ui/react';
import { InfoTooltip, NumberedTextArea } from 'src/shared';
import { Observer, observer } from 'mobx-react-lite';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useForm } from 'react-hook-form';
import { AnalyticsGraphQueryStore } from '../../model';
import { useSearchParams } from 'react-router-dom';
import RefillModal from 'src/entities/balance/ui/RefillModal';
import { InsufficientBalanceModal } from 'src/entities/balance/ui/InsufficientBalanceModal';
import { AxiosError } from 'axios';

interface GraphAnalyticsFormProps extends BoxProps {
    analyticsGraphQueryStore: AnalyticsGraphQueryStore;
}

const GraphAnalyticsForm: FC<GraphAnalyticsFormProps> = ({
    analyticsGraphQueryStore,
    ...props
}) => {
    const textAreaLineHeight = 22;
    const {
        register,
        formState: { errors, dirtyFields },
        handleSubmit
    } = useForm<{
        isBetweenAccountsOnly: boolean;
        addresses: string;
    }>();
    const [_, setSearchParams] = useSearchParams();
    const {
        isOpen: isInsufficientBalanceOpen,
        onClose: onInsufficientBalanceClose,
        onOpen: onInsufficientBalanceOpen
    } = useDisclosure();
    const {
        isOpen: isRefillOpen,
        onClose: onRefillClose,
        onOpen: onRefillOpen
    } = useDisclosure();

    let insufficientBalanceError = '';

    const onSubmit = async (form: { isBetweenAccountsOnly: boolean; addresses: string }) => {
        try {
            const addresses = form.addresses
                .replaceAll(/[,; \t\v\f\r]/g, '')
                .trim()
                .split('\n')
                .map(value => {
                    if (/^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-.]+$/.test(value)) {
                        return value.toLowerCase();
                    }
                    return value;
                });
            const query = await analyticsGraphQueryStore.createQuery({
                addresses,
                isBetweenSelectedOnly: form.isBetweenAccountsOnly
            });
            setSearchParams({ id: query.id });
        } catch (error) {
            const axiosError = error as AxiosError<{ error: string }>;
            if (axiosError?.response?.status === 402) {
                // Handle insufficient balance error from server
                insufficientBalanceError = axiosError?.response?.data?.error || 'Insufficient balance to execute this query';
                onInsufficientBalanceOpen();
            }
            // Other errors are handled by the toast in the store
        }
    };

    const isFormDisabled =
        analyticsGraphQueryStore.query$.value?.status === 'executing' ||
        analyticsGraphQueryStore.createQuery.isLoading;

    return (
        <chakra.form
            {...props}
            h="100%"
            display="flex"
            flexDirection="column"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
        >
            <FormControl alignItems="center" gap="1" display="flex" mb="3">
                <Checkbox
                    mb="0 !important"
                    isDisabled={isFormDisabled}
                    {...register('isBetweenAccountsOnly')}
                >
                    Only between these accounts
                </Checkbox>
                <InfoTooltip>
                    <Box textStyle="body2" maxW="300px">
                        If selected, only transactions for which both the sender and recipient are
                        listed below will be displayed. Otherwise, all transactions will be shown,
                        either the sender or the recipient of which is specified in the list
                    </Box>
                </InfoTooltip>
            </FormControl>
            <Box flex="1" overflowX="auto">
                <AutoSizer>
                    {({ height, width }) => (
                        <Observer>
                            {() => (
                                <>
                                    <FormControl mb="6" isInvalid={!!errors.addresses}>
                                        <NumberedTextArea
                                            minRows={3}
                                            isDisabled={isFormDisabled}
                                            wrapperProps={{
                                                height: 'fit-content',
                                                width,
                                                minW: '700px',
                                                maxHeight: height
                                            }}
                                            placeholder="Address"
                                            maxRows={
                                                height
                                                    ? Math.floor(
                                                          (height - 100) / textAreaLineHeight
                                                      ) - 1
                                                    : 4
                                            }
                                            resize="none"
                                            {...register('addresses', {
                                                pattern: {
                                                    value: /^([,; \t\v\f\r]*[a-zA-Z0-9_.:\-]+[,; \t\v\f\r]*\n)*[,; \t\v\f\r]*[a-zA-Z0-9_.:\-]+[,; \t\v\f\r]*\s*$/,
                                                    message:
                                                        'Insert one address or ton domain on one line'
                                                },

                                                required: 'This is required'
                                            })}
                                        />
                                        <FormErrorMessage pos="static" w={width}>
                                            {errors.addresses && errors.addresses.message}
                                        </FormErrorMessage>
                                        <Box
                                            textStyle="body3"
                                            w={width}
                                            mt="2"
                                            color="text.secondary"
                                        >
                                            Enter up to 10 addresses
                                        </Box>
                                    </FormControl>

                                    <Flex
                                        textStyle="label2"
                                        align="center"
                                        gap="3"
                                        w={width}
                                        color="text.secondary"
                                        fontWeight="700"
                                    >
                                        <Button
                                            w="fit-content"
                                            isDisabled={!dirtyFields.addresses}
                                            isLoading={isFormDisabled}
                                            type="submit"
                                        >
                                            Send
                                        </Button>
                                        <Box>The request can cost from 0.01 up to 1 TON</Box>
                                    </Flex>
                                </>
                            )}
                        </Observer>
                    )}
                </AutoSizer>
            </Box>
            <InsufficientBalanceModal
                isOpen={isInsufficientBalanceOpen}
                onClose={onInsufficientBalanceClose}
                onOpenRefill={onRefillOpen}
                errorMessage={insufficientBalanceError}
            />
            <RefillModal isOpen={isRefillOpen} onClose={onRefillClose} />
        </chakra.form>
    );
};

export default observer(GraphAnalyticsForm);
