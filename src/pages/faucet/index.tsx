import { FunctionComponent, useId } from 'react';
import { observer } from 'mobx-react-lite';
import { H4, Overlay } from 'src/shared';
import { Button, Divider } from '@chakra-ui/react';
import { FaucetForm, faucetStore, RequestFaucetForm } from 'src/features';

const FaucetPage: FunctionComponent = () => {
    const formId = useId();

    const onSubmit = (form: RequestFaucetForm): void => {
        console.log(form);
    };

    return (
        <Overlay h="fit-content">
            <H4 mb="5">Testnet assets</H4>
            <Divider w="auto" mb="4" mx="-6" />
            <FaucetForm
                id={formId}
                tonLimit={faucetStore.tonSupply$.value || undefined}
                tonLimitLoading={false}
                onSubmit={onSubmit}
                mb="6"
                w="512px"
            />
            <Button form={formId} type="submit">
                Buy Testnet Assets
            </Button>
        </Overlay>
    );
};

export default observer(FaucetPage);
