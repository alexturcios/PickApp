"use client"

const banners = [
  {
    id: 1,
    headline: "Trending Tops",
    subtitle: "Casual & graphic tees from $25",
    cta: "Shop Tops",
    gradient: "from-[#299E60]/8 to-[#299E60]/3",
    emoji: "👕",
  },
  {
    id: 2,
    headline: "Seasonal Sale",
    subtitle: "Up to 40% off selected styles",
    cta: "View Sale",
    gradient: "from-[#FF6B35]/8 to-[#FF6B35]/3",
    emoji: "🔥",
  },
  {
    id: 3,
    headline: "New Arrivals",
    subtitle: "Fresh drops added daily",
    cta: "Explore New",
    gradient: "from-[#121535]/5 to-[#121535]/2",
    emoji: "✨",
  },
  {
    id: 4,
    headline: "Best Sellers",
    subtitle: "Most loved by our community",
    cta: "See Popular",
    gradient: "from-[#E63946]/6 to-[#E63946]/2",
    emoji: "🏆",
  },
]

export const PromoBannerStack = () => {
  return (
    <section className="w-full px-4 lg:px-8">
      <div className="flex flex-col gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`w-full bg-gradient-to-r ${banner.gradient} rounded-[16px] p-5 md:p-6 flex items-center justify-between hover:shadow-[0_8px_24px_0_rgba(18,21,53,0.08)] transition-shadow cursor-pointer`}
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-[16px] md:text-[18px] font-bold text-[#121535] tracking-[-0.0170em]">
                {banner.headline}
              </h3>
              <p className="text-[13px] text-[#6C757D] tracking-[-0.0170em]">{banner.subtitle}</p>
              <button className="self-start mt-2 px-6 py-2 bg-[#FF6B35] text-white font-semibold text-[12px] rounded-[50px] shadow-[0_6px_16px_0_rgba(255,107,53,0.25)] hover:bg-[#e85a28] transition-colors">
                {banner.cta}
              </button>
            </div>
            <span className="text-4xl md:text-5xl">{banner.emoji}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
