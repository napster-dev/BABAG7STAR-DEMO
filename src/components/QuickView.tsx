"use client";

import Link from "next/link";
import { X, Heart, ShoppingBag, Zap, Truck, ShieldCheck } from "lucide-react";
import { useStore } from "@/store/StoreContext";
import { formatPrice } from "@/data/products";
import { Stars } from "./UI";
import { cn } from "@/lib/utils";

export default function QuickView() {
  const { quickView: p, setQuickView, addToCart, toggleWishlist, isWishlisted } = useStore();
  if (!p) return null;
  const wished = isWishlisted(p.slug);

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={`Quick view ${p.name}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setQuickView(null)} />
      <div className="relative w-full max-w-3xl bg-[#141414] border border-[#D4A017]/25 rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,.8)] animate-fadeUp grid md:grid-cols-2 max-h-[90vh]">
        <button onClick={() => setQuickView(null)} className="absolute top-4 right-4 z-10 w-9 h-9 grid place-items-center rounded-full bg-black/70 border border-white/15 hover:text-[#F5C542]" aria-label="Close quick view"><X size={17} /></button>
        <div className="relative bg-black min-h-[260px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover md:rounded-l-3xl aspect-square md:aspect-auto md:h-full" />
          {p.compareAt && <span className="absolute top-4 left-4 gold-bg text-black text-xs font-black px-3 py-1 rounded-full">SAVE {formatPrice(p.compareAt - p.price)}</span>}
        </div>
        <div className="p-6 sm:p-8 overflow-y-auto">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#F5C542] uppercase">{p.brand}</p>
          <h3 className="font-display font-black text-2xl leading-tight mt-2">{p.name}</h3>
          <p className="text-white/55 text-sm mt-1">{p.tagline}</p>
          <div className="flex items-center gap-2 mt-3">
            <Stars rating={p.rating} size={15} />
            <span className="text-[13px] text-white/50">{p.rating} • {p.reviewsCount.toLocaleString()} reviews</span>
          </div>
          <div className="flex items-baseline gap-3 mt-4">
            <span className="font-display font-black text-3xl gold-text">{formatPrice(p.price)}</span>
            {p.compareAt && <span className="text-white/35 line-through">{formatPrice(p.compareAt)}</span>}
          </div>
          <p className="text-white/60 text-sm leading-relaxed mt-4 line-clamp-4">{p.description}</p>
          <div className="flex gap-2.5 mt-6">
            <button onClick={() => { addToCart(p); setQuickView(null); }} className="flex-1 gold-btn rounded-xl py-3 text-sm flex items-center justify-center gap-2"><ShoppingBag size={16} /> Add to Cart</button>
            <button onClick={() => toggleWishlist(p.slug)} aria-label="Wishlist" className={cn("w-12 grid place-items-center rounded-xl border transition-all", wished ? "bg-[#F5C542] text-black border-transparent" : "border-white/15 text-white/70 hover:text-[#F5C542] hover:border-[#F5C542]/50")}><Heart size={18} className={wished ? "fill-black" : ""} /></button>
          </div>
          <Link href={`/product/${p.slug}`} onClick={() => setQuickView(null)} className="mt-3 w-full ghost-btn rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 text-white"><Zap size={15} className="text-[#F5C542]" /> View Full Details</Link>
          <div className="flex items-center gap-4 mt-5 text-[12px] text-white/50">
            <span className="flex items-center gap-1.5"><Truck size={14} className="text-[#F5C542]" /> Free ship $75+</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#F5C542]" /> 12-mo warranty</span>
          </div>
        </div>
      </div>
    </div>
  );
}
