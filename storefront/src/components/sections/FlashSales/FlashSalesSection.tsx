"use client"

import { useState, useEffect } from "react"

function getRandomFutureDate() {
  const now = Date.now()
  const randomMs = Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000) + 1 * 24 * 60 * 60 * 1000
  return now + randomMs
}

let cachedTarget: number | null = null
function getTarget() {
  if (!cachedTarget) cachedTarget = getRandomFutureDate()
  return cachedTarget
}

function calcTimeLeft(target: number) {
  const diff = Math.max(0, target - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export const FlashSalesSection = () => {
  const [target] = useState(getTarget)
  const [time, setTime] = useState(calcTimeLeft(target))

  useEffect(() => {
    const timer = setInterval(() => setTime(calcTimeLeft(target)), 1000)
    return () => clearInterval(timer)
  }, [target])

  const TimerPill = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="bg-[#121535] text-white font-bold text-[16px] md:text-[20px] rounded-[50px] px-4 py-2 min-w-[56px] text-center tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-[#6C757D] mt-1 uppercase tracking-wider font-medium">{label}</span>
    </div>
  )

  return (
    <section className="w-full px-4 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#121535] tracking-[-0.0230em]">⚡ Flash Sales</h2>
          <button className="text-[14px] text-[#299E60] font-semibold mt-1 hover:underline">See all deals →</button>
        </div>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full border border-[#E6E6E6] bg-[#FFFFFF] flex items-center justify-center hover:bg-[#F2F9F5] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#121535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button className="w-9 h-9 rounded-full border border-[#E6E6E6] bg-[#FFFFFF] flex items-center justify-center hover:bg-[#F2F9F5] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#121535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-[#E63946]/10 to-[#FF6B35]/10 rounded-[16px] p-6 md:p-8 flex flex-col items-center gap-5">
        <h3 className="text-lg md:text-xl font-bold text-[#121535] tracking-[-0.0230em] text-center">
          Hurry! Deals end in
        </h3>
        <div className="flex gap-3 md:gap-4">
          <TimerPill value={time.days} label="Days" />
          <span className="text-[#121535] font-bold text-[20px] self-start mt-2">:</span>
          <TimerPill value={time.hours} label="Hours" />
          <span className="text-[#121535] font-bold text-[20px] self-start mt-2">:</span>
          <TimerPill value={time.minutes} label="Min" />
          <span className="text-[#121535] font-bold text-[20px] self-start mt-2">:</span>
          <TimerPill value={time.seconds} label="Sec" />
        </div>
        <button className="px-8 py-3 bg-[#FF6B35] text-white font-semibold text-[14px] rounded-[50px] shadow-[0_6px_16px_0_rgba(255,107,53,0.25)] hover:bg-[#e85a28] transition-colors">
          Shop Flash Sales
        </button>
      </div>
    </section>
  )
}
