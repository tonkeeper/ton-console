import { FC } from 'react';
import { chakra, StyleProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import NameControl from './controls/NameControl';
import AddressControl from './controls/AddressControl';
import FeeControl from './controls/FeeControl';
import { AirdropMetadata } from 'src/features/airdrop/model/interfaces/AirdropMetadata';

type JettonFormProps = StyleProps & {
    id?: string;
    onSubmit: SubmitHandler<AirdropMetadata>;
};

const AirdropForm: FC<JettonFormProps> = observer(({ id, onSubmit, ...rest }) => {
    const context = useFormContext<AirdropMetadata>();
    const { handleSubmit } = context;

    const submitHandler = (form: AirdropMetadata): void => {
        onSubmit(form);
    };

    return (
        <chakra.form
            id={id}
            w="100%"
            onSubmit={handleSubmit(submitHandler)}
            noValidate
            gap={4}
            display="flex"
            flexDirection="column"
            {...rest}
        >
            <NameControl context={context} />
            <AddressControl context={context} />
            <FeeControl context={context} />
        </chakra.form>
    );
});

export default AirdropForm;
