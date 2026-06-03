import { Footer, Header, MobileHeader } from "@/components/organisms"
import { Sidebar } from "@/components/organisms/Sidebar/Sidebar"
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar"
import { retrieveCustomer } from "@/lib/data/customer"
import { checkRegion } from "@/lib/helpers/check-region"
import { Session } from "@talkjs/react"
import { redirect } from "next/navigation"

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const APP_ID = process.env.NEXT_PUBLIC_TALKJS_APP_ID
  const { locale } = await params

  const user = await retrieveCustomer()
  const regionCheck = await checkRegion(locale)

  if (!regionCheck) {
    return redirect("/")
  }

  const shell = (
    <>
      {/* Desktop icon rail */}
      <Sidebar />

      {/* Mobile sticky header */}
      <MobileHeader />

      {/* Content column, offset for the rail on desktop */}
      <div className="md:pl-[76px] min-h-screen flex flex-col bg-canvas">
        <div className="hidden lg:block sticky top-0 z-30 bg-canvas">
          <Header />
        </div>
        <div className="flex-1">{children}</div>
        <Footer />
      </div>

      {/* Sticky floating search pill (wired to live Algolia search) */}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center px-4 md:pl-[76px]">
        <div className="pointer-events-auto w-full max-w-[560px]">
          <SearchBar floating />
        </div>
      </div>
    </>
  )

  if (!APP_ID || !user) return shell

  return (
    <Session appId={APP_ID} userId={user.id}>
      {shell}
    </Session>
  )
}
