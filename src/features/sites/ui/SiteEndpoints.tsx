import {
    Box,
    Button,
    ButtonGroup,
    FormControl,
    FormErrorMessage,
    Input,
    chakra
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FC, useCallback } from 'react';
import { DTOTonSite, H4 } from 'src/shared';
import { sitesStore } from '../model/sites.store';
import { useForm } from 'react-hook-form';

interface SiteEndpointFormValues {
    endpoint: string;
}

const SiteEndpoints: FC<{ site: DTOTonSite; onClose: () => void }> = ({ site, onClose }) => {
    const formId = 'site-endpoints-form';
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SiteEndpointFormValues>();

    const submitHandler = useCallback(
        async (form: SiteEndpointFormValues) => {
            try {
                await sitesStore.updateEndpoints(site.id, [form.endpoint]).then(() => onClose());
            } catch (e) {
                console.error(e);
            }
        },
        [site]
    );

    return (
        <Box paddingY={5}>
            <H4>Endpoint</H4>
            <chakra.form
                id={formId}
                maxW="480px"
                paddingY={3}
                onSubmit={handleSubmit(submitHandler)}
                noValidate
            >
                <FormControl isInvalid={!!errors.endpoint} isRequired>
                    <Input
                        autoComplete="off"
                        autoFocus
                        defaultValue={site.endpoints[0]}
                        id="endpoint"
                        placeholder="http://15.29.87.01:433 or https://example.com"
                        {...register('endpoint', {
                            required: 'This is required'
                        })}
                    />

                    <FormErrorMessage pos="static">{errors.endpoint?.message}</FormErrorMessage>
                </FormControl>
            </chakra.form>
            <ButtonGroup mt={3} spacing={3}>
                <Button form={formId} type="submit">
                    Save
                </Button>
                <Button onClick={onClose} variant="secondary">
                    Cancel
                </Button>
            </ButtonGroup>
        </Box>
    );
};

export default observer(SiteEndpoints);
