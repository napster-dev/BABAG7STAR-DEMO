"use client";

import { useEffect, useRef } from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ rating, size = 14, className }: { rating: number; size?: number; className?: string }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.4;
  return (
    <span className={cn("inline-flex items-center gap-[2px]", className)} aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <Star key={i} size={size} className="fill-[#F5C542] text-[#F5C542]" />;
        if (i === full && half) return <StarHalf key={i} size={size} className="fill-[#F5C542] text-[#F5C542]" />;
        return <Star key={i} size={size} className="text-white/25" />;
      })}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, sub, align = "center" }: { eyebrow: string; title: React.ReactNode; sub?: string; align?: "center" | "left" }) {
  return (
    <div className={cn("reveal max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      <p className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.28em] text-[#F5C542] uppercase">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#F5C542]" />
        {eyebrow}
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#F5C542]" />
      </p>
      <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-[42px] leading-tight mt-3">{title}</h2>
      {sub && <p className="text-white/60 mt-3 text-[15px] leading-relaxed">{sub}</p>}
    </div>
  );
}

export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("reveal", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-[#1A1A1A] border border-white/10 overflow-hidden">
      <div className="skeleton aspect-square" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 rounded w-1/3" />
        <div className="skeleton h-4 rounded w-4/5" />
        <div className="skeleton h-4 rounded w-2/5" />
      </div>
    </div>
  );
}

export function useRevealAll(dep?: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.is-visible)");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [dep]);
}
