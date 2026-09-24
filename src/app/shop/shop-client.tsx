"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { PRODUCTS, formatPrice } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Stars } from "@/components/UI";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

export default function ShopClient() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") ?? "";
  const cat = params.get("cat") ?? "all";
  const sort = params.get("sort") ?? "featured";

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(600);
  const [minRating, setMinRating] = useState(0);
  const [onSale, setOnSale] = useState(false);
  const [page, setPage] = useState(1);

  const setParam = (key: string, value: string) => {
    const sp = new URLSearchParams(params.toString());
    if (!value || value === "all" || value === "featured") sp.delete(key);
    else sp.set(key, value);
    router.push(`/shop?${sp.toString()}`);
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (cat !== "all") list = list.filter((p) => p.category === cat || (cat === "new" && p.isNew));
    if (q) {
      const n = q.toLowerCase();
      list = list.filter((p) => (p.name + p.tagline + p.category + p.brand).toLowerCase().includes(n));
    }
    list = list.filter((p) => p.price <= maxPrice);
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);
    if (onSale) list = list.filter((p) => p.compareAt);
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "newest": list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)); break;
      case "popular": list.sort((a, b) => b.soldCount - a.soldCount); break;
      case "trending": list = list.filter((p) => p.isTrending); break;
      case "discount": list = list.filter((p) => p.compareAt).sort((a, b) => (1 - b.price / b.compareAt!) - (1 - a.price / a.compareAt!)); break;
      default: list.sort((a, b) => Number(b.isBestSeller ?? false) - Number(a.isBestSeller ?? false));
    }
    return list;
  }, [cat, q, sort, maxPrice, minRating, onSale]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(0, page * PAGE_SIZE);

  const cats = [
    ["all", "All Products"],
    ["electronics", "Electronics"],
    ["smart-gadgets", "Smart Gadgets"],
    ["home-living", "Home & Living"],
    ["accessories", "Accessories"],
  ];

  const FilterPanel = (
    <div className="space-y-7">
      <div>
        <h4 className="font-display font-bold text-sm tracking-widest text-[#F5C542] mb-3">CATEGORY</h4>
        <div className="space-y-1.5">
          {cats.map(([slug, name]) => (
            <button key={slug} onClick={() => setParam("cat", slug)} className={cn("w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all", cat === slug ? "gold-bg text-black" : "bg-white/5 text-white/70 hover:bg-white/10")}>
              {name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-display font-bold text-sm tracking-widest text-[#F5C542] mb-3">MAX PRICE: <span className="text-white">{formatPrice(maxPrice)}</span></h4>
        <input type="range" min={25} max={600} step={5} value={maxPrice} onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }} className="w-full accent-[#F5C542]" aria-label="Max price" />
        <div className="flex justify-between text-[12px] text-white/40 mt-1"><span>$25</span><span>$600</span></div>
      </div>
      <div>
        <h4 className="font-display font-bold text-sm tracking-widest text-[#F5C542] mb-3">RATING</h4>
        <div className="space-y-1.5">
          {[0, 4.5, 4.6, 4.7, 4.8].map((r) => (
            <button key={r} onClick={() => { setMinRating(r); setPage(1); }} className={cn("w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all", minRating === r ? "bg-[#F5C542]/15 border border-[#F5C542]/40" : "hover:bg-white/5 border border-transparent")}>
              {r === 0 ? "All ratings" : <><Stars rating={r} size={13} /> <span className="text-white/60 text-[13px]">{r}+</span></>}
            </button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 text-sm font-semibold cursor-pointer hover:bg-white/10">
        <input type="checkbox" checked={onSale} onChange={(e) => { setOnSale(e.target.checked); setPage(1); }} className="w-4 h-4 accent-[#F5C542]" />
        On sale only 🏷️
      </label>
      <button onClick={() => { setMaxPrice(600); setMinRating(0); setOnSale(false); setParam("cat", "all"); }} className="w-full ghost-btn rounded-xl py-2.5 text-[13px] font-bold text-white">Reset filters</button>
    </div>
  );

  return (
    <div className="bg-[#0B0B0B] min-h-screen">
      <div className="bg-[#0e0e0e] border-b border-white/8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
          <p className="text-[11px] font-bold tracking-[0.3em] text-[#F5C542]">★ THE CATALOG</p>
          <h1 className="font-display font-black text-3xl sm:text-5xl mt-2 capitalize">
            {q ? <>Results for <span className="gold-text">“{q}”</span></> : cat === "all" ? <>Shop <span className="gold-text">everything</span></> : <><span className="gold-text">{cats.find((c) => c[0] === cat)?.[1] ?? cat}</span></>}
          </h1>
          <p className="text-white/55 mt-2 text-[15px]">{filtered.length} premium products • Free shipping over $75 • 30-day returns</p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 flex gap-8">
        {/* sidebar desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-28 bg-[#141414] border border-white/8 rounded-3xl p-6">{FilterPanel}</div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* toolbar */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setFiltersOpen(true)} className="lg:hidden flex items-center gap-2 bg-[#1A1A1A] border border-white/12 rounded-full px-4 py-2.5 text-[13px] font-bold">
              <SlidersHorizontal size={15} className="text-[#F5C542]" /> Filters
            </button>
            <p className="text-[13px] text-white/50 hidden sm:block">Showing <span className="text-white font-bold">{visible.length}</span> of {filtered.length}</p>
            <div className="relative ml-auto">
              <select value={sort} onChange={(e) => setParam("sort", e.target.value)} className="appearance-none bg-[#1A1A1A] border border-white/12 rounded-full pl-5 pr-10 py-2.5 text-[13px] font-bold focus:border-[#F5C542]/60" aria-label="Sort products">
                <option value="featured">Featured</option>
                <option value="popular">Most popular</option>
                <option value="newest">Newest</option>
                <option value="rating">Top rated</option>
                <option value="price-asc">Price: low → high</option>
                <option value="price-desc">Price: high → low</option>
                <option value="discount">Biggest discount</option>
                <option value="trending">Trending</option>
              </select>
              <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="text-center py-24 bg-[#141414] rounded-3xl border border-white/8">
              <p className="text-5xl">🛰️</p>
              <h3 className="font-display font-black text-2xl mt-4">No signals found</h3>
              <p className="text-white/55 mt-2">Try widening your price range or clearing filters.</p>
              <button onClick={() => { setMaxPrice(600); setMinRating(0); setOnSale(false); }} className="gold-btn rounded-full px-7 py-3 text-sm mt-6">Clear all filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {visible.map((p, i) => <ProductCard key={p.slug} product={p} index={i % 8} />)}
              </div>
              {page < pages && (
                <div className="text-center mt-10">
                  <button onClick={() => setPage((v) => v + 1)} className="gold-btn rounded-full px-9 py-3.5 text-sm">
                    Load more ({filtered.length - visible.length} remaining)
                  </button>
                  <div className="flex justify-center gap-1.5 mt-5">
                    {Array.from({ length: pages }).map((_, i) => (
                      <button key={i} onClick={() => setPage(i + 1)} aria-label={`Page ${i + 1}`} className={cn("h-2 rounded-full transition-all", i + 1 <= page ? "w-8 gold-bg" : "w-2 bg-white/20")} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setFiltersOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[320px] max-w-[85vw] bg-[#141414] border-r border-white/10 p-6 overflow-y-auto animate-fadeUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-black text-lg">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="p-2 rounded-full hover:bg-white/10" aria-label="Close filters"><X size={19} /></button>
            </div>
            {FilterPanel}
            <button onClick={() => setFiltersOpen(false)} className="gold-btn w-full rounded-xl py-3 text-sm mt-6">Show {filtered.length} results</button>
          </div>
        </div>
      )}
    </div>
  );
}
