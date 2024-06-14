import { FunctionComponent } from 'react';
import {
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    StyleProps
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { apiClient, isAddersValid, Span } from 'src/shared';

export type IndexingCnftCollectionDataT = Parameters<
    typeof apiClient.api.indexingCnftCollection
>[1];

export const CNFTAddForm: FunctionComponent<
    StyleProps & {
        id?: string;
        onSubmit: SubmitHandler<IndexingCnftCollectionDataT>;
    }
> = ({ id, onSubmit, ...rest }) => {
    const submitHandler = (form: IndexingCnftCollectionDataT): void => {
        onSubmit(form);
    };

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<IndexingCnftCollectionDataT>({});

    return (
        <chakra.form id={id} w="100%" onSubmit={handleSubmit(submitHandler)} noValidate {...rest}>
            <FormControl isInvalid={!!errors.account} isRequired>
                <FormLabel htmlFor="address">Address</FormLabel>
                <Input
                    autoComplete="off"
                    id="address"
                    {...register('account', {
                        required: 'This is required',
                        validate: value => {
                            if (!isAddersValid(value, { acceptTestnet: true, acceptRaw: true })) {
                                return 'Wrong address';
                            }
                        }
                    })}
                />
                <FormErrorMessage pos="static">
                    {errors.account && errors.account.message}
                </FormErrorMessage>
            </FormControl>
            <FormControl mb="0" isInvalid={!!errors.count} isRequired>
                <FormLabel htmlFor="count">Amount</FormLabel>
                <InputGroup>
                    <Input
                        borderRightRadius={0}
                        autoComplete="off"
                        id="count"
                        {...register('count', {
                            required: 'This is required',
                            validate: value => {
                                if (!value || value < 1) {
                                    return 'Amount should be greater than 0';
                                }
                            }
                        })}
                    />
                    <InputRightElement justifyContent="start" w="50%" borderLeftWidth={1}>
                        <Span textStyle="body2" color="text.secondary" pl={4}>
                            Price:
                        </Span>
                    </InputRightElement>
                </InputGroup>
                <FormErrorMessage pos="static">
                    {errors.account && errors.account.message}
                </FormErrorMessage>
            </FormControl>
        </chakra.form>
    );
};
