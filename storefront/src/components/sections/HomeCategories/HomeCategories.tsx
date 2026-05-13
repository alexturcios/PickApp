import Image from "next/image"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export const categories: { id: number; name: string; handle: string }[] = [
  {
    id: 1,
    name: "Sneakers",
    handle: "sneakers",
  },
  {
    id: 2,
    name: "Sandals",
    handle: "sandals",
  },
  {
    id: 3,
    name: "Boots",
    handle: "boots",
  },
  {
    id: 4,
    name: "Sport",
    handle: "sport",
  },
  {
    id: 5,
    name: "Accessories",
    handle: "accessories",
  },
]

export const HomeCategories = async ({ heading }: { heading: string }) => {
  return (
    <section className="py-4 w-full">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#121535] tracking-[-0.0230em] uppercase">{heading}</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center">
        {categories.map((category) => (
          <LocalizedClientLink
            key={category.id}
            href={`/categories/${category.handle}`}
            className="flex flex-col items-center gap-2 flex-shrink-0"
          >
            <div className="w-[80px] h-[80px] rounded-full bg-[#FFFFFF] shadow-[0_4px_12px_0_rgba(18,21,53,0.05)] flex items-center justify-center overflow-hidden border border-[#E6E6E6] hover:shadow-[0_8px_24px_0_rgba(18,21,53,0.08)] transition-shadow">
              <Image
                loading="lazy"
                src={`/images/categories/${category.handle}.png`}
                alt={`category - ${category.name}`}
                width={60}
                height={60}
                sizes="60px"
                className="object-contain"
              />
            </div>
            <span className="text-[11px] text-[#121535] font-medium tracking-[-0.0180em] text-center whitespace-nowrap">
              {category.name}
            </span>
          </LocalizedClientLink>
        ))}
      </div>
    </section>
  )
}
