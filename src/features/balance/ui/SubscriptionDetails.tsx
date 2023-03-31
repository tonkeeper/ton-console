import { FunctionComponent } from 'react';
import { TonApiSubscriptionDetails } from '../../tonapi';
import { ISubscriptionDetails, SERVICE } from 'src/entities';
import { exhaustiveCheck } from 'src/shared';

export const SubscriptionDetails: FunctionComponent<{
    details: ISubscriptionDetails;
}> = ({ details }) => {
    switch (details.service) {
        case SERVICE.TONAPI:
            return <TonApiSubscriptionDetails details={details} />;
        default:
            exhaustiveCheck(details.service);
            console.error(
                `Subscription details component is not defined for ${details.service} service`
            );
            return <>Payment</>;
    }
};
