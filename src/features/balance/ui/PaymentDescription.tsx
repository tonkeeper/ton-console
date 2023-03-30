import { FunctionComponent } from 'react';
import { ITonApiPaymentDescription, TonApiPaymentDescription } from 'src/features';
import { IPaymentDescription, SERVICE } from 'src/entities';
import { exhaustiveCheck } from 'src/shared';

export const PaymentDescription: FunctionComponent<{
    description: IPaymentDescription;
}> = ({ description }) => {
    switch (description.service) {
        case SERVICE.TONAPI:
            return (
                <>
                    Payment,{' '}
                    <TonApiPaymentDescription
                        description={description as ITonApiPaymentDescription}
                    />
                </>
            );
        default:
            exhaustiveCheck(description.service);
            console.error(
                `Payment description component is not defined for ${description.service} service`
            );
            return <>Payment</>;
    }
};
