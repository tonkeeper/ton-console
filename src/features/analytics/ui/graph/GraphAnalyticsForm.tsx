import { ComponentProps, FunctionComponent } from 'react';
import { Box, Button, chakra, Checkbox, FormControl, FormErrorMessage } from '@chakra-ui/react';
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
    }>();
    const [_, setSearchParams] = useSearchParams();

    const onSubmit = async (form: { isBetweenAccountsOnly: boolean; addresses: string }) => {
        const addresses = [...form.addresses.match(/[a-zA-Z0-9-_]{48}/g)!];
        const query = await analyticsGraphQueryStore.createQuery({
            addresses,
            isBetweenSelectedOnly: form.isBetweenAccountsOnly
        });
        setSearchParams({ id: query.id });
    };

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
                    isDisabled={analyticsGraphQueryStore.query$.isLoading}
                    {...register('isBetweenAccountsOnly')}
                >
                    Only between these accounts
                </Checkbox>
                <InfoTooltip>Description</InfoTooltip>
            </FormControl>
            <Box flex="1">
                <AutoSizer>
                    {({ height, width }) => (
                        <Observer>
                            {() => (
                                <>
                                    <FormControl mb="6" isInvalid={!!errors.addresses}>
                                        <NumberedTextArea
                                            isDisabled={analyticsGraphQueryStore.query$.isLoading}
                                            wrapperProps={{
                                                height: 'fit-content',
                                                width,
                                                maxHeight: height
                                            }}
                                            placeholder="Enter addresses"
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
                                            onPaste={() => {
                                                setTimeout(() => {
                                                    const value = getValues('addresses');

                                                    setValue(
                                                        'addresses',
                                                        value
                                                            .match(/[a-zA-Z0-9-_]{48}/g)
                                                            ?.join('\n') || value
                                                    );
                                                });
                                            }}
                                        />
                                        <FormErrorMessage w={width}>
                                            {errors.addresses && errors.addresses.message}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <Button
                                        w="fit-content"
                                        isDisabled={!dirtyFields.addresses}
                                        isLoading={analyticsGraphQueryStore.query$.isLoading}
                                        type="submit"
                                    >
                                        Send
                                    </Button>
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
