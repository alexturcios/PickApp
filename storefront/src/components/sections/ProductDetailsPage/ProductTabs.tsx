"use client"

import { AlgoliaHit } from "@/lib/algolia-helpers"
import { useState } from "react"

export const ProductTabs = ({ product }: { product: AlgoliaHit }) => {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description")

  return (
    <div className="bg-[#FFFFFF] rounded-[16px] shadow-[0_4px_12px_0_rgba(18,21,53,0.05)] border border-[#E6E6E6] p-6 lg:p-8">
      {/* Tabs Header */}
      <div className="flex items-center justify-between border-b border-[#E6E6E6] pb-4 mb-6">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab("description")}
            className={`px-4 py-2 rounded-[50px] text-[13px] font-semibold transition-colors ${activeTab === "description" ? "bg-[#299E60] text-white" : "text-[#6C757D] hover:bg-[#F2F9F5]"}`}
          >
            Description
          </button>
          <button 
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 rounded-[50px] text-[13px] font-semibold transition-colors ${activeTab === "reviews" ? "bg-[#299E60] text-white" : "text-[#6C757D] hover:bg-[#F2F9F5]"}`}
          >
            Reviews
          </button>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-[#F2F9F5] px-3 py-1.5 rounded-[50px]">
          <span className="text-[14px]">🥗</span>
          <span className="text-[12px] text-[#299E60] font-semibold">100% Satisfaction Guaranteed</span>
        </div>
      </div>

      {/* Tab Content: Description */}
      {activeTab === "description" && (
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-[16px] font-bold text-[#121535] mb-4">Product Description</h3>
            <div className="text-[13px] text-[#6C757D] space-y-4 leading-relaxed">
              <p>Wherever celebrations and good times happen, the brand will be there just as it has been for more than 75 years. With flavors almost as rich as our history, we have a product guaranteed to bring a smile on your face.</p>
              <p>{product.description || "Morbi ut sapien vitae odio accumsan gravida. Morbi vitae erat auctor, eleifend nunc a, lobortis neque. Praesent aliquam dignissim viverra."}</p>
              <ul className="list-disc pl-5 space-y-1 mt-4">
                <li>8.0 oz. bag of classic quality</li>
                <li>Tasty and great snack</li>
                <li>Includes three ingredients: quality, love, and care</li>
                <li>Gluten free product</li>
              </ul>
              <div className="mt-6 pt-4 text-[12px]">
                <p>Made in USA</p>
                <p>Ready To Eat.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[16px] font-bold text-[#121535] mb-4">Product Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
              {[
                { label: "Product Type", value: product.product_type || "Chips & Dips" },
                { label: "Product Name", value: product.title },
                { label: "Brand", value: "Premium" },
                { label: "FSA Eligible", value: "No" },
                { label: "Size/Count", value: "8.0oz" },
                { label: "Item Code", value: product.objectID },
                { label: "Ingredients", value: "Potatoes, Vegetable Oil, and Salt." },
              ].map((spec, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#299E60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bg-[#F2F9F5] rounded-full p-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span className="font-semibold text-[#121535]">{spec.label}:</span>
                  <span className="text-[#6C757D]">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[16px] font-bold text-[#121535] mb-4">Nutrition Facts</h3>
            <div className="space-y-3">
              {[
                { label: "Total Fat", value: "10g 13%" },
                { label: "Saturated Fat", value: "1.5g 7%" },
              ].map((nut, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#299E60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bg-[#F2F9F5] rounded-full p-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span className="font-semibold text-[#121535]">{nut.label}</span>
                  <span className="text-[#6C757D]">{nut.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Reviews */}
      {activeTab === "reviews" && (
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left: Review List & Form */}
          <div className="flex-1 flex flex-col gap-8">
            <div>
              <h3 className="text-[16px] font-bold text-[#121535] mb-6">Product Reviews</h3>
              
              {/* Review Item */}
              <div className="flex gap-4 border-b border-[#E6E6E6] pb-6 mb-6">
                <div className="w-10 h-10 bg-[#E6E6E6] rounded-full flex-shrink-0 flex items-center justify-center text-[#6C757D] font-bold">NC</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-[13px] font-bold text-[#121535]">Nicolas cage</h4>
                    <span className="text-[11px] text-[#6C757D]">3 Days ago</span>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#FFB800" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <h5 className="text-[13px] font-bold text-[#121535] mb-2">Great Product</h5>
                  <p className="text-[13px] text-[#6C757D] mb-4">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour</p>
                  <div className="flex gap-4 text-[12px] text-[#6C757D]">
                    <button className="flex items-center gap-1 hover:text-[#299E60]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg> Like</button>
                    <button className="flex items-center gap-1 hover:text-[#299E60]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 14 20 9 15 4"></polyline><path d="M4 20v-7a4 4 0 0 1 4-4h12"></path></svg> Reply</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Write Review Form */}
            <div className="bg-[#F8F9FA] p-6 rounded-[16px] border border-[#E6E6E6]">
              <h3 className="text-[16px] font-bold text-[#121535] mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="block text-[12px] font-bold text-[#121535] mb-2">What is it like to Product?</label>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFB800" strokeWidth="2" className="cursor-pointer hover:fill-[#FFB800]">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[12px] font-bold text-[#121535] mb-2">Review Title</label>
                <input type="text" placeholder="Great Products" className="w-full px-4 py-2 border border-[#E6E6E6] rounded-[8px] text-[13px] outline-none focus:border-[#299E60]" />
              </div>
              <div className="mb-4">
                <label className="block text-[12px] font-bold text-[#121535] mb-2">Review Content</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-[#E6E6E6] rounded-[8px] text-[13px] outline-none focus:border-[#299E60]" placeholder="Write your review here..."></textarea>
              </div>
              <button className="bg-[#FF6B35] text-white px-6 py-2 rounded-[50px] text-[13px] font-semibold hover:bg-[#e85a28] shadow-[0_6px_16px_0_rgba(255,107,53,0.25)]">Submit Review</button>
            </div>
          </div>

          {/* Right: Feedback Stats */}
          <div className="w-full md:w-[300px] flex-shrink-0 flex flex-col gap-6">
            <h3 className="text-[16px] font-bold text-[#121535]">Customers Feedback</h3>
            
            <div className="flex gap-4">
              <div className="w-1/3 bg-[#F8F9FA] rounded-[12px] border border-[#E6E6E6] flex flex-col items-center justify-center py-6">
                <span className="text-3xl font-bold text-[#299E60]">4.8</span>
                <div className="flex my-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i < 4 ? "#FFB800" : "#E6E6E6"} stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="text-[9px] text-[#6C757D] text-center px-2">Average Product Rating</span>
              </div>
              
              <div className="flex-1 bg-[#FFFFFF] rounded-[12px] border border-[#E6E6E6] p-4 flex flex-col gap-2">
                {[
                  { stars: 5, pct: "70%", count: 124 },
                  { stars: 4, pct: "20%", count: 52 },
                  { stars: 3, pct: "8%", count: 12 },
                  { stars: 2, pct: "2%", count: 5 },
                  { stars: 1, pct: "0%", count: 2 },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] text-[#6C757D]">
                    <span className="w-2">{row.stars}</span>
                    <div className="flex-1 h-1.5 bg-[#E6E6E6] rounded-full overflow-hidden">
                      <div className="h-full bg-[#299E60]" style={{ width: row.pct }}></div>
                    </div>
                    <div className="flex w-12 justify-end gap-1">
                       {[...Array(5)].map((_, i) => (
                          <svg key={i} width="6" height="6" viewBox="0 0 24 24" fill={i < row.stars ? "#FFB800" : "#E6E6E6"} stroke="none">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                    </div>
                    <span className="w-4 text-right">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
