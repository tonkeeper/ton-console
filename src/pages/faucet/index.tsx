import { FunctionComponent, useId } from 'react';
import { observer } from 'mobx-react-lite';
import { H4, isNumber, Overlay } from 'src/shared';
import { Button, Divider } from '@chakra-ui/react';
import { FaucetForm, faucetStore, RequestFaucetForm, FaucetFormInternal } from 'src/features';
import { FormProvider, useForm } from 'react-hook-form';
import BigNumber from 'bignumber.js';

const FaucetPage: FunctionComponent = () => {
    const formId = useId();

    const methods = useForm<FaucetFormInternal>();

    const { watch } = methods;
    const amount = watch('tonAmount');
    const rate = faucetStore.tonRate$.value;

    let cost;
    if (faucetStore.tonRate$.isResolved && isNumber(amount) && Number(amount)) {
        cost = new BigNumber(Number(amount)).multipliedBy(rate).toString(); // TODO format
    }

    const onSubmit = (form: RequestFaucetForm): void => {
        console.log(form);
    };

    return (
        <Overlay h="fit-content">
            <H4 mb="5">Testnet assets</H4>
            <Divider w="auto" mb="4" mx="-6" />
            <FormProvider {...methods}>
                <FaucetForm
                    id={formId}
                    tonLimit={faucetStore.tonSupply$.value || undefined}
                    tonLimitLoading={false}
                    onSubmit={onSubmit}
                    mb="6"
                    w="512px"
                />
            </FormProvider>
            <Button form={formId} type="submit">
                {cost ? `Buy for ${cost} TON` : 'Buy Testnet Assets'}
            </Button>
        </Overlay>
    );
};

export default observer(FaucetPage);
