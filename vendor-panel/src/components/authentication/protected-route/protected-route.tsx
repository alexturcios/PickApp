import { Spinner } from "@medusajs/icons"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useMe } from "../../../hooks/api/users"
import { OnboardingGate } from "../../pickapp/onboarding-gate"
import { SearchProvider } from "../../../providers/search-provider"
import { SidebarProvider } from "../../../providers/sidebar-provider"
import { TalkjsProvider } from "../../../providers/talkjs-provider"

export const ProtectedRoute = () => {
  const { seller, isPending, error } = useMe()

  const location = useLocation()
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="text-ui-fg-interactive animate-spin" />
      </div>
    )
  }

  if (!seller) {
    return (
      <Navigate
        to={`/login${error?.message ? `?reason=${error.message}` : ""}`}
        state={{ from: location }}
        replace
      />
    )
  }

  return (
    <TalkjsProvider>
      <SidebarProvider>
        <SearchProvider>
          <OnboardingGate>
            <Outlet />
          </OnboardingGate>
        </SearchProvider>
      </SidebarProvider>
    </TalkjsProvider>
  )
}
