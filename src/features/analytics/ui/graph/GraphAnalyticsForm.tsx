import { ComponentProps, FunctionComponent } from 'react';
import { Box, Button, chakra, Checkbox, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { InfoTooltip, NumberedTextArea } from 'src/shared';
import { observer } from 'mobx-react-lite';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useForm } from 'react-hook-form';
import { analyticsGraphQueryStore } from '../../model';

const GraphAnalyticsForm: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const textAreaLineHeight = 22;
    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue
    } = useForm<{
        isBetweenAccountsOnly: boolean;
        addresses: string;
    }>();

    const onSubmit = (form: { isBetweenAccountsOnly: boolean; addresses: string }): void => {
        const addresses = [...form.addresses.match(/[a-zA-Z0-9-_]{48}/g)!];
        analyticsGraphQueryStore.createQuery({
            addresses,
            isBetweenSelectedOnly: form.isBetweenAccountsOnly
        });
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
                <Checkbox mb="0 !important" {...register('isBetweenAccountsOnly')}>
                    Only between these accounts
                </Checkbox>
                <InfoTooltip>Description</InfoTooltip>
            </FormControl>
            <Box flex="1">
                <AutoSizer>
                    {({ height, width }) => (
                        <>
                            <FormControl mb="6" isInvalid={!!errors.addresses}>
                                <NumberedTextArea
                                    wrapperProps={{
                                        height: 'fit-content',
                                        width,
                                        maxHeight: height
                                    }}
                                    placeholder="Enter your query"
                                    maxRows={
                                        height
                                            ? Math.floor((height - 40) / textAreaLineHeight) - 1
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
                                        const value = e.clipboardData.getData('text');
                                        setTimeout(() =>
                                            setValue(
                                                'addresses',
                                                value.match(/[a-zA-Z0-9-_]{48}/g)?.join('\n') ||
                                                    value
                                            )
                                        );
                                    }}
                                />
                                <FormErrorMessage w={width}>
                                    {errors.addresses && errors.addresses.message}
                                </FormErrorMessage>
                            </FormControl>
                            <Button w="fit-content" type="submit">
                                Send
                            </Button>
                        </>
                    )}
                </AutoSizer>
            </Box>
        </chakra.form>
    );
};

export default observer(GraphAnalyticsForm);
