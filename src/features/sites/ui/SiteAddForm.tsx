import { FC } from 'react';
import { chakra, FormControl, FormErrorMessage, StyleProps, Input } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Site, sitesStore } from '../model/sites.store';
import { observer } from 'mobx-react-lite';

const SiteAddForm: FC<
    StyleProps & {
        id?: string;
        onSubmit: SubmitHandler<Site>;
    }
> = ({ id, onSubmit, ...rest }) => {
    const submitHandler = (form: Site): void => {
        onSubmit(form);
    };

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<Site>({});

    return (
        <chakra.form id={id} w="100%" onSubmit={handleSubmit(submitHandler)} noValidate {...rest}>
            <FormControl isInvalid={!!errors.domain} isRequired>
                <Input
                    autoComplete="off"
                    autoFocus
                    id="domain"
                    placeholder="Domain with .ton, .t.me"
                    {...register('domain', {
                        required: 'This is required',
                        validate: value => {
                            const domain = value.trim();
                            const validDomain = domain.endsWith('.ton') || domain.endsWith('.t.me');
                            if (!validDomain) {
                                return 'Domain should end with .ton or .t.me';
                            }

                            if (sitesStore.sites$.value.some(site => site.domain === domain)) {
                                return 'Domain already exists';
                            }
                        }
                    })}
                />

                <FormErrorMessage pos="static">{errors.domain?.message}</FormErrorMessage>
            </FormControl>
        </chakra.form>
    );
};

export default observer(SiteAddForm);
