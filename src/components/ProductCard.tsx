"use client";

import Link from "next/link";
import { Heart, Eye, ShoppingBag, Zap } from "lucide-react";
import { type Product, formatPrice } from "@/data/products";
import { useStore } from "@/store/StoreContext";
import { Stars } from "./UI";
import { cn } from "@/lib/utils";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, isWishlisted, setQuickView } = useStore();
  const wished = isWishlisted(product.slug);
  const discount = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;

  return (
    <div
      className="group relative rounded-2xl bg-[#141414] border border-white/8 overflow-hidden card-hover animate-fadeUp"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      {/* image */}
      <div className="relative aspect-square overflow-hidden bg-[#0e0e0e]">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={`${product.name} — ${product.tagline}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 pointer-events-none" />
        {/* badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && <span className="gold-bg text-black text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg">-{discount}%</span>}
          {product.badge && <span className="bg-black/80 backdrop-blur border border-[#F5C542]/50 text-[#F5C542] text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full">{product.badge}</span>}
          {product.isNew && <span className="bg-emerald-500 text-black text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full">NEW</span>}
        </div>
        {/* wishlist */}
        <button
          onClick={() => toggleWishlist(product.slug)}
          aria-label="Add to wishlist"
          className={cn(
            "absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full backdrop-blur transition-all",
            wished ? "bg-[#F5C542] text-black shadow-[0_0_18px_rgba(245,197,66,.6)]" : "bg-black/60 text-white/80 hover:text-[#F5C542] border border-white/15"
          )}
        >
          <Heart size={16} className={wished ? "fill-black" : ""} />
        </button>
        {/* quick actions */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button onClick={() => setQuickView(product)} className="flex-1 ghost-btn bg-black/70 backdrop-blur rounded-xl py-2.5 text-[12px] font-bold flex items-center justify-center gap-1.5 text-white">
            <Eye size={14} /> Quick View
          </button>
          <button onClick={() => addToCart(product)} className="flex-1 gold-btn rounded-xl py-2.5 text-[12px] flex items-center justify-center gap-1.5" aria-label={`Add ${product.name} to cart`}>
            <ShoppingBag size={14} /> Add to Cart
          </button>
        </div>
        {product.stock <= 30 && (
          <span className="absolute bottom-3 left-3 group-hover:hidden flex items-center gap-1 text-[11px] font-bold text-orange-300 bg-black/70 px-2 py-1 rounded-full">
            <Zap size={11} /> Only {product.stock} left
          </span>
        )}
      </div>

      {/* body */}
      <div className="p-4">
        <p className="text-[11px] font-bold tracking-[0.18em] text-white/40 uppercase">{product.brand} • <span className="capitalize">{product.category.replace("-", " ")}</span></p>
        <Link href={`/product/${product.slug}`} className="block font-display font-bold text-[15px] leading-snug mt-1.5 hover:text-[#F5C542] transition-colors line-clamp-2 min-h-[42px]">
          {product.name}
        </Link>
        <div className="flex items-center gap-2 mt-1.5">
          <Stars rating={product.rating} />
          <span className="text-[12px] text-white/45">({product.reviewsCount.toLocaleString()})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-display font-black text-[19px] gold-text">{formatPrice(product.price)}</span>
          {product.compareAt && <span className="text-[13px] text-white/35 line-through">{formatPrice(product.compareAt)}</span>}
        </div>
      </div>
    </div>
  );
}
