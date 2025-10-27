import { FC, useContext } from 'react';
import { Link, Skeleton, Td, Tr } from '@chakra-ui/react';
import { toDateTime, DTOBillingTransaction, explorer } from 'src/shared';
import { DTOBillingTxInfo } from 'src/shared/api';
import { BillingHistoryTableContext } from './BillingHistoryTableContext';
import {
    DTOCnftIndexingPaymentMeta,
    DTOLiteproxyChangeTierMeta,
    DTOLiteproxyMonthlyPaymentMeta,
    DTOMessagePackagePurchaseMeta,
    DTOPromoCodeActivationMeta,
    DTOReplenishmentOfDepositMeta,
    DTOStreamingApiPaymentMeta,
    DTOTestnetTonsPurchaseMeta,
    DTOTonapiChangeTierMeta,
    DTOTonapiInstantPaymentMeta,
    DTOTonapiMonthlyPaymentMeta
} from 'src/shared/api/console/types.gen';
import { BillingHistoryItem } from 'src/shared/hooks/useBillingHistoryQuery';

// TODO: Remove this mapping after fixing the sdk generator
const reasonMapping = {
    TonapiMonthlyPaymentMeta: 'tonapi_monthly_payment',
    TonapiInstantPaymentMeta: 'tonapi_instant_payment',
    TonapiChangeTierMeta: 'tonapi_change_tier',
    LiteproxyMonthlyPaymentMeta: 'liteproxy_monthly_payment',
    LiteproxyChangeTierMeta: 'liteproxy_change_tier',
    TestnetTonsPurchaseMeta: 'testnet_tons_purchase',
    CnftIndexingPaymentMeta: 'cnft_indexing_payment',
    MessagePackagePurchaseMeta: 'message_package_purchase',
    ChatGptRequestPaymentMeta: 'chatgpt_request_payment',
    PromoCodeActivationMeta: 'promo_code_activation',
    StreamingApiPaymentMeta: 'streaming_api_payment',
    ReplenishmentOfDepositMeta: 'replenishment_of_deposit',
    AnalyticsRequestPaymentMeta: 'analytics_request_payment',
    OtherMeta: 'Default'
} as const satisfies Record<DTOBillingTxInfo['reason'], string>;

type ReasonMeta = keyof typeof reasonMapping; // DTOBillingTxInfo['reason']
type ReasonSnake = (typeof reasonMapping)[ReasonMeta];

const reverseReasonMapping: Record<ReasonSnake, ReasonMeta> = Object.fromEntries(
    Object.entries(reasonMapping).map(([meta, snake]) => [snake, meta as ReasonMeta])
) as Record<ReasonSnake, ReasonMeta>;

type DescriptionFormattersMap = {
    [K in ReasonSnake]: (
        info: Extract<DTOBillingTxInfo, { reason: (typeof reverseReasonMapping)[K] }>,
        fallbackDescription: string
    ) => React.ReactNode;
};

const descriptionFormatters: DescriptionFormattersMap = {
    tonapi_monthly_payment: info => {
        const meta = info as DTOTonapiMonthlyPaymentMeta;
        const tierName = meta.tier?.name;
        return (
            <>
                REST API monthly payment
                {tierName && (
                    <>
                        — <strong>{tierName}</strong>
                    </>
                )}
            </>
        );
    },
    tonapi_instant_payment: info => {
        const meta = info as DTOTonapiInstantPaymentMeta;
        const tierName = meta.tier?.name;
        return (
            <>
                REST API payment
                {tierName && (
                    <>
                        {' '}
                        — <strong>{tierName}</strong>
                    </>
                )}
            </>
        );
    },
    tonapi_change_tier: info => {
        const meta = info as DTOTonapiChangeTierMeta;
        const newTierName = meta.new_tier?.name;
        return (
            <>
                REST API tier change
                {newTierName && (
                    <>
                        {' '}
                        <strong>{newTierName}</strong>
                    </>
                )}
            </>
        );
    },
    liteproxy_monthly_payment: info => {
        const meta = info as DTOLiteproxyMonthlyPaymentMeta;
        const tierName = meta.tier?.name;
        return (
            <>
                Liteservers monthly payment
                {tierName && (
                    <>
                        {' '}
                        — <strong>{tierName}</strong>
                    </>
                )}
            </>
        );
    },
    liteproxy_change_tier: info => {
        const meta = info as DTOLiteproxyChangeTierMeta;
        const newTierName = meta.new_tier?.name;
        return (
            <>
                Liteservers tier change
                {newTierName && (
                    <>
                        {' '}
                        → <strong>{newTierName}</strong>
                    </>
                )}
            </>
        );
    },
    testnet_tons_purchase: info => {
        const meta = info as DTOTestnetTonsPurchaseMeta;
        return (
            <>
                Testnet coins purchase
                {meta.testnet_coins && (
                    <>
                        {' '}
                        — <strong>{meta.testnet_coins} coins</strong>
                    </>
                )}
            </>
        );
    },
    cnft_indexing_payment: info => {
        const meta = info as DTOCnftIndexingPaymentMeta;
        return (
            <>
                NFT indexing
                {meta.collection && (
                    <>
                        {' '}
                        — <strong>{meta.collection}</strong>
                    </>
                )}
                {meta.count && (
                    <>
                        {' '}
                        <strong>({meta.count} items)</strong>
                    </>
                )}
            </>
        );
    },
    message_package_purchase: info => {
        const meta = info as DTOMessagePackagePurchaseMeta;
        return (
            <>
                Message package
                {meta.count && (
                    <>
                        {' '}
                        — <strong>{meta.count} messages</strong>
                    </>
                )}
            </>
        );
    },
    chatgpt_request_payment: () => <>ChatGPT API request</>,
    promo_code_activation: info => {
        const meta = info as DTOPromoCodeActivationMeta;
        return (
            <>
                Promo code activation
                {meta.promo_code && (
                    <>
                        {' '}
                        — <strong>{meta.promo_code}</strong>
                    </>
                )}
            </>
        );
    },
    streaming_api_payment: info => {
        const meta = info as DTOStreamingApiPaymentMeta;
        if (!meta.period) {
            return <>Webhooks API payment</>;
        }
        const minutes = Math.round(meta.period / 60);
        const hours = Math.round(minutes / 60);
        const timeStr = minutes >= 60 ? `${hours}h` : `${minutes}m`;
        return (
            <>
                Webhooks API payment — <strong>{timeStr}</strong>
            </>
        );
    },
    replenishment_of_deposit: info => {
        const { tx_hash } = info as DTOReplenishmentOfDepositMeta;

        return (
            <>
                Refill {' '}
                {tx_hash && <Link href={explorer.transactionLink(tx_hash)} isExternal>{tx_hash.slice(-8)}</Link>}
            </>
        );
    },
    analytics_request_payment: () => <>Analytics query</>,
    Default: (_info, fallbackDescription) => <>{fallbackDescription}</>
};

function formatBillingDescription(historyItem: BillingHistoryItem): React.ReactNode {
    const { info, description } = historyItem;
    const formatterKey = (
        info.reason in descriptionFormatters ? info.reason : 'Default'
    ) as keyof typeof descriptionFormatters;

    const formatter = descriptionFormatters[formatterKey];
    const descriptionNode = formatter(info, description);
    return descriptionNode;
}

const SkeletonRow: FC<{ style: React.CSSProperties }> = ({ style: { top, ...style } }) => {
    const { rowHeight } = useContext(BillingHistoryTableContext);
    return (
        <Tr
            sx={{ td: { px: 2, py: 0 } }}
            pos="absolute"
            top={parseFloat(top!.toString()) + parseFloat(rowHeight) + 'px'}
            left="0"
            display="table-row"
            w="100%"
            h={rowHeight}
            maxH={rowHeight}
            style={style}
        >
            <Td
                minW="150px"
                h={rowHeight}
                maxH={rowHeight}
                borderLeft="1px"
                borderLeftColor="background.contentTint"
                boxSizing="content-box"
            >
                <Skeleton w="120px" h="4" />
            </Td>
            <Td w="100%" minW="320px" h={rowHeight} maxH={rowHeight} boxSizing="content-box">
                <Skeleton w="200px" h="4" />
            </Td>
            <Td
                w="180px"
                minW="180px"
                h={rowHeight}
                maxH={rowHeight}
                borderRight="1px"
                borderRightColor="background.contentTint"
            >
                <Skeleton w="100px" h="4" />
            </Td>
        </Tr>
    );
};

const mapTypeToColor: Record<DTOBillingTransaction['type'], string> = {
    charge: 'text.primary',
    deposit: 'accent.green'
};

const mapTypeToSign: Record<DTOBillingTransaction['type'], string> = {
    charge: '-',
    deposit: '+'
};

const ItemRow: FC<{ historyItem: BillingHistoryItem; style: React.CSSProperties }> = ({
    historyItem,
    style
}) => {
    const { rowHeight } = useContext(BillingHistoryTableContext);

    return (
        <Tr
            sx={{ td: { px: 2, py: 0 } }}
            pos="absolute"
            top={parseFloat(style.top!.toString()) + parseFloat(rowHeight) + 'px'}
            left="0"
            display="table-row"
            w="100%"
            h={rowHeight}
            maxH={rowHeight}
        >
            <Td
                minW="150px"
                h={rowHeight}
                maxH={rowHeight}
                borderLeft="1px"
                borderLeftColor="background.contentTint"
                boxSizing="content-box"
            >
                {toDateTime(historyItem.date)}
            </Td>
            <Td w="100%" minW="320px" h={rowHeight} maxH={rowHeight} boxSizing="content-box">
                {formatBillingDescription(historyItem)}
            </Td>
            <Td
                w="180px"
                minW="180px"
                h={rowHeight}
                maxH={rowHeight}
                color={mapTypeToColor[historyItem.type] ?? 'text.accent'}
                borderRight="1px"
                borderRightColor="background.contentTint"
                title={historyItem.amount.stringAmountWithoutRound}
            >
                {mapTypeToSign[historyItem.type]}
                {historyItem.amount.stringCurrencyAmount}
            </Td>
        </Tr>
    );
};

const BillingTableRow: FC<{ index: number; style: React.CSSProperties }> = ({ index, style }) => {
    const { billingHistory, isLoading } = useContext(BillingHistoryTableContext);

    if (isLoading || !billingHistory || !billingHistory[index]) {
        return <SkeletonRow style={style} />;
    }

    const historyItem = billingHistory[index];
    return <ItemRow key={historyItem.id} style={style} historyItem={historyItem} />;
};

export default BillingTableRow;
