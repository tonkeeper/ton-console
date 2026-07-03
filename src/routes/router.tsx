import { Navigate, Route, Routes } from "react-router"

import {
  DashboardPage,
  LandingPage,
  LoginPage,
} from "./fragments"
import {
  AnalyticsGraphPage,
  AnalyticsHistoryPage,
  AnalyticsQueryPage,
} from "@/fragments/analytics/analytics-page"
import { BillingPage } from "@/fragments/billing/billing-page"
import { TonApiApiKeysPage } from "@/fragments/tonapi/api-keys/api-keys-page"
import { TonApiWebhookDetailPage } from "@/fragments/tonapi/webhooks/webhook-detail-page"
import { TonApiWebhooksPage } from "@/fragments/tonapi/webhooks/webhooks-page"
import { TonApiLiteserversPage } from "@/fragments/tonapi/liteservers/liteservers-page"
import { TonApiPricingPage } from "@/fragments/tonapi/pricing/pricing-page"
import { RequireProject, RequireSession } from "./guards"
import { AuthenticatedLayout } from "./layouts/authenticated-layout"
import { SettingsPage } from "@/fragments/settings/settings-page"
import { ProfilePage } from "@/fragments/profile/profile-page"
import { MessagesPage } from "@/fragments/messages/messages-page"
import { InvoicesPage } from "@/fragments/invoices/invoices-page"
import { NftPage } from "@/fragments/nft/nft-page"
import { FaucetPage } from "@/fragments/faucet/faucet-page"
import {
  JettonMinterPage,
  JettonMinterViewPage,
  JettonPage,
} from "@/fragments/jetton/jetton-page"
import {
  JettonAirdropCreatePage,
  JettonAirdropDetailPage,
  JettonAirdropsPage,
} from "@/fragments/jetton/airdrops/airdrop-page"
import { CreateFirstProjectPage } from "@/fragments/projects/create-first-project-page"

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireSession />}>
        <Route
          path="/create-first-project"
          element={<CreateFirstProjectPage />}
        />
        <Route element={<RequireProject />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/tonapi"
              element={<Navigate to="/tonapi/api-keys" replace />}
            />
            <Route path="/tonapi/api-keys" element={<TonApiApiKeysPage />} />
            <Route path="/tonapi/webhooks" element={<TonApiWebhooksPage />} />
            <Route
              path="/tonapi/webhooks/:webhookId"
              element={<TonApiWebhookDetailPage />}
            />
            <Route path="/tonapi/pricing" element={<TonApiPricingPage />} />
            <Route
              path="/tonapi/liteservers"
              element={<TonApiLiteserversPage />}
            />
            <Route
              path="/analytics"
              element={<Navigate to="/analytics/history" replace />}
            />
            <Route
              path="/analytics/history"
              element={<AnalyticsHistoryPage />}
            />
            <Route path="/analytics/query" element={<AnalyticsQueryPage />} />
            <Route path="/analytics/graph" element={<AnalyticsGraphPage />} />
            <Route path="/invoices/*" element={<InvoicesPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/nft" element={<NftPage />} />
            <Route path="/jetton" element={<JettonPage />} />
            <Route path="/jetton/minter" element={<JettonMinterPage />} />
            <Route
              path="/jetton/minter/view/:address"
              element={<JettonMinterViewPage />}
            />
            <Route path="/jetton/airdrops" element={<JettonAirdropsPage />} />
            <Route
              path="/jetton/airdrops/create"
              element={<JettonAirdropCreatePage />}
            />
            <Route
              path="/jetton/airdrops/:id"
              element={<JettonAirdropDetailPage />}
            />
            <Route path="/faucet" element={<FaucetPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
