import { FC } from 'react';
import { chakra, StyleProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { JettonMetadata } from '@ton-api/client';
import NameControl from './controls/NameControl';
import SymbolControl from './controls/SymbolControl';
import DecimalControl from './controls/DecimalControl';
import MintControl from './controls/MintControl';
import DescriptionControl from './controls/DescriptionControl';
import LogoControl from './controls/LogoControl';

export type RawJettonMetadata = Omit<JettonMetadata, 'address' | 'image'> & {
    mint: string;
    image?: FileList | string;
};

type JettonFormProps = StyleProps & {
    id?: string;
    onSubmit: SubmitHandler<RawJettonMetadata>;
};

const JettonForm: FC<JettonFormProps> = observer(({ id, onSubmit, ...rest }) => {
    const context = useFormContext<RawJettonMetadata>();
    const { handleSubmit } = context;

    return (
        <chakra.form
            id={id}
            w="100%"
            maxW={600}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            gap={4}
            display="flex"
            flexDirection="column"
            {...rest}
        >
            <NameControl context={context} />
            <SymbolControl context={context} />
            <DecimalControl context={context} />
            <MintControl context={context} />
            <DescriptionControl context={context} />
            <LogoControl context={context} />
        </chakra.form>
    );
});

export default JettonForm;
