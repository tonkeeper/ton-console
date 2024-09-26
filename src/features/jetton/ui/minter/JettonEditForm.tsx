import { FC } from 'react';
import { chakra, StyleProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { JettonMetadata } from '@ton-api/client';
import NameControl from './controls/NameControl';
import SymbolControl from './controls/SymbolControl';
import DescriptionControl from './controls/DescriptionControl';
import LogoControl from './controls/LogoControl';

export type EditJettonMetadata = Pick<JettonMetadata, 'name' | 'symbol' | 'description' | 'image'>;

export const toEditJettonMetadataFormValues = (metadata: JettonMetadata): EditJettonMetadata => {
    return {
        name: metadata.name,
        symbol: metadata.symbol,
        description: metadata.description,
        image: metadata.image
    };
};

type JettonEditFormProps = StyleProps & {
    id?: string;
    onSubmit: SubmitHandler<EditJettonMetadata>;
};

const JettonEditForm: FC<JettonEditFormProps> = observer(({ id, onSubmit, ...rest }) => {
    const context = useFormContext<EditJettonMetadata>();
    const { handleSubmit } = context;

    const submitHandler = (form: EditJettonMetadata): void => {
        onSubmit(form);
    };

    return (
        <chakra.form
            id={id}
            w="100%"
            maxW={600}
            onSubmit={handleSubmit(submitHandler)}
            noValidate
            gap={4}
            display="flex"
            flexDirection="column"
            {...rest}
        >
            <NameControl context={context} />
            <SymbolControl context={context} />
            <DescriptionControl context={context} />
            <LogoControl context={context} />
        </chakra.form>
    );
});

export default JettonEditForm;
