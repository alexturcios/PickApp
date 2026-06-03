import Image from "next/image"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import footerLinks from "@/data/footerLinks"

const columns: {
  title: string
  links: { label: string; path: string; external?: boolean }[]
}[] = [
  { title: "Customer services", links: footerLinks.customerServices },
  { title: "About", links: footerLinks.about },
  { title: "Connect", links: footerLinks.connect.map((l) => ({ ...l, external: true })) },
]

export function Footer() {
  return (
    <footer className="border-t border-line bg-canvas px-4 pb-28 pt-12 lg:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-12 lg:flex-row lg:justify-between">
        {/* Brand block */}
        <div className="max-w-xs">
          <Image src="/Logo.svg" width={120} height={32} alt="Pickapp" />
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            Pickapp is your everything marketplace — independent sellers, smart-locker
            pickup, and the things you love in one place.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <span className="flex h-10 w-32 items-center justify-center rounded-sm bg-ink text-[12px] font-medium text-white">
              App Store
            </span>
            <span className="flex h-10 w-32 items-center justify-center rounded-sm bg-ink text-[12px] font-medium text-white">
              Google Play
            </span>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-[14px] font-semibold uppercase text-ink">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Go to ${l.label}`}
                        className="text-[14px] text-muted transition-colors hover:text-brand-green"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <LocalizedClientLink
                        href={l.path}
                        className="text-[14px] text-muted transition-colors hover:text-brand-green"
                      >
                        {l.label}
                      </LocalizedClientLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1400px] flex-col items-center justify-between gap-3 border-t border-line py-6 text-[13px] text-muted sm:flex-row">
        <span>© {new Date().getFullYear()} Pickapp</span>
        <span className="flex items-center gap-2">
          Powered by MercurJS
          <span className="text-ink/20">|</span>
          <LocalizedClientLink href="/" className="hover:text-brand-green">
            Start selling
          </LocalizedClientLink>
        </span>
      </div>
    </footer>
  )
}
