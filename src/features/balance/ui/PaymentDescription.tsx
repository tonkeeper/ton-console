import { FunctionComponent } from 'react';
import { ITonApiPaymentDescription, TonApiPaymentDescription } from 'src/features';
import { IPaymentDescription } from 'src/entities';

export const PaymentDescription: FunctionComponent<{
    description: IPaymentDescription;
}> = ({ description }) => {
    switch (description.service) {
        case 'tonapi':
            return (
                <>
                    Payment,{' '}
                    <TonApiPaymentDescription
                        description={description as ITonApiPaymentDescription}
                    />
                </>
            );
        default:
            console.error(
                `Payment description component is not defined for ${description.service} service`
            );
            return <>Payment</>;
    }
};
