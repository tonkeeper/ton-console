import { ComponentProps, FunctionComponent } from 'react';
import {
    Box,
    Button,
    chakra,
    Checkbox,
    Flex,
    FormControl,
    FormErrorMessage
} from '@chakra-ui/react';
import { InfoTooltip, NumberedTextArea } from 'src/shared';
import { Observer, observer } from 'mobx-react-lite';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useForm } from 'react-hook-form';
import { analyticsGraphQueryStore } from '../../model';
import { useSearchParams } from 'react-router-dom';

const GraphAnalyticsForm: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const textAreaLineHeight = 22;
    const {
        register,
        formState: { errors, dirtyFields },
        handleSubmit,
        setValue,
        getValues
    } = useForm<{
        isBetweenAccountsOnly: boolean;
        addresses: string;
    }>({ mode: 'all' });
    const [_, setSearchParams] = useSearchParams();

    const onSubmit = async (form: { isBetweenAccountsOnly: boolean; addresses: string }) => {
        const addresses = [...form.addresses.match(/[a-zA-Z0-9-_]{48}/g)!];
        const query = await analyticsGraphQueryStore.createQuery({
            addresses,
            isBetweenSelectedOnly: form.isBetweenAccountsOnly
        });
        setSearchParams({ id: query.id });
    };

    const isFormDisabled = analyticsGraphQueryStore.query$.value?.status === 'executing';

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
            <Box flex="1">
                <AutoSizer>
                    {({ height, width }) => (
                        <Observer>
                            {() => (
                                <>
                                    <FormControl mb="6" isInvalid={!!errors.addresses}>
                                        <NumberedTextArea
                                            isDisabled={isFormDisabled}
                                            wrapperProps={{
                                                height: 'fit-content',
                                                width,
                                                maxHeight: height
                                            }}
                                            placeholder="Enter address in user-friendly format"
                                            maxRows={
                                                height
                                                    ? Math.floor(
                                                          (height - 40) / textAreaLineHeight
                                                      ) - 1
                                                    : 4
                                            }
                                            resize="none"
                                            {...register('addresses', {
                                                pattern: {
                                                    value: /^([a-zA-Z0-9-_]{48}\s+)*[a-zA-Z0-9-_]{48}\s*$/,
                                                    message:
                                                        'Insert one address in user-friendly format on one line'
                                                },

                                                required: 'This is required'
                                            })}
                                            onPaste={e => {
                                                const pasted = e.clipboardData.getData('text');

                                                const pastedCorrect =
                                                    /^([a-zA-Z0-9-_]{48}[^a-zA-Z0-9-_]+)*[a-zA-Z0-9-_]{48}[^a-zA-Z0-9-_]*$/.test(
                                                        pasted
                                                    );

                                                const textArea = e.target as HTMLTextAreaElement;
                                                const isSelectedAllContent =
                                                    textArea.selectionStart === 0 &&
                                                    textArea.selectionEnd === textArea.textLength;
                                                const isPastedToEnd =
                                                    textArea.selectionStart ===
                                                        textArea.selectionEnd &&
                                                    textArea.selectionEnd === textArea.textLength;

                                                if (
                                                    pastedCorrect &&
                                                    (isPastedToEnd || isSelectedAllContent)
                                                ) {
                                                    e.preventDefault();
                                                    const value = isSelectedAllContent
                                                        ? ''
                                                        : getValues('addresses');

                                                    const formattedPasted =
                                                        pasted
                                                            .match(/[a-zA-Z0-9-_]{48}/g)
                                                            ?.join('\n') || pasted;

                                                    const divider = value.endsWith('\n')
                                                        ? ''
                                                        : '\n';

                                                    setValue(
                                                        'addresses',
                                                        value
                                                            ? value + divider + formattedPasted
                                                            : formattedPasted,
                                                        {
                                                            shouldValidate: true,
                                                            shouldDirty: true,
                                                            shouldTouch: true
                                                        }
                                                    );
                                                }
                                            }}
                                        />
                                        <FormErrorMessage w={width}>
                                            {errors.addresses && errors.addresses.message}
                                        </FormErrorMessage>
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
        </chakra.form>
    );
};

export default observer(GraphAnalyticsForm);
