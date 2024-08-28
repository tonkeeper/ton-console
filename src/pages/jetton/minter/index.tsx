import { Flex, BoxProps, Button } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
// import { CNFTStore } from 'src/features';
import JettonForm from 'src/features/jetton/ui/minter/JettonForm';
import { H4, Overlay } from 'src/shared';

const JettonPage: FC<BoxProps> = () => {
    const formId = 'jetton-form-id';
    // const cnftStore = useLocalObservable(() => new CNFTStore());
    // const isSitesEmpty = cnftStore.history$.value.length === 0;

    // if (isSitesEmpty && cnftStore.history$.isLoading) {
    //     return (
    //         <Overlay display="flex" justifyContent="center" alignItems="center">
    //             <Spinner />
    //         </Overlay>
    //     );
    // }

    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="flex-start" justify="space-between" mb="5">
                <H4>Mint your token</H4>
            </Flex>
            <JettonForm onSubmit={() => alert('Mint Jettons')} id={formId} />
            <Button flex={1} form={formId} type="submit" variant="primary">
                Mint
            </Button>
        </Overlay>
    );
};

export default observer(JettonPage);
