"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Zap, Minus, Plus, Truck, ShieldCheck, RotateCcw, Lock, ChevronRight, Check, ZoomIn } from "lucide-react";
import { getProduct, relatedProducts, formatPrice } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Stars, Reveal } from "@/components/UI";
import { useStore } from "@/store/StoreContext";
import { cn } from "@/lib/utils";

export default function ProductClient({ slug }: { slug: string }) {
  const p = getProduct(slug);
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState(0);
  const [tab, setTab] = useState<"details" | "specs" | "reviews" | "shipping">("details");
  const [zoom, setZoom] = useState(false);

  const related = useMemo(() => relatedProducts(slug, 4), [slug]);
  if (!p) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl">🛸</p>
        <h1 className="font-display font-black text-3xl mt-4">Product not found</h1>
        <Link href="/shop" className="gold-btn rounded-full px-8 py-3.5 text-sm inline-block mt-6">Back to shop</Link>
      </div>
    );
  }

  const wished = isWishlisted(p.slug);
  const discount = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
  const variant = [p.colors?.[color]?.name, p.sizes?.[size]].filter(Boolean).join(" / ");

  const buyNow = () => {
    addToCart(p, qty, variant || undefined);
    router.push("/checkout");
  };

  // Fake reviews seeded per product (replace with /api/reviews GET in production)
  const reviews = [
    { name: "Verified Buyer", stars: 5, title: "Exceeded expectations", body: `Genuine product, fast delivery, premium packaging. The ${p.name} works flawlessly — highly recommended.` },
    { name: "Star Customer", stars: 5, title: "Worth every dollar", body: "Quality feels luxury. Setup took minutes and support answered my question within an hour." },
    { name: "Happy Shopper", stars: 4, title: "Great, minor nitpick", body: "Superb value overall. Delivery took 3 days. Would absolutely buy from BabaG7Star again." },
  ];

  return (
    <div className="bg-[#0B0B0B]">
      {/* breadcrumb */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-6 flex items-center gap-1.5 text-[13px] text-white/45">
        <Link href="/" className="hover:text-[#F5C542]">Home</Link><ChevronRight size={13} />
        <Link href="/shop" className="hover:text-[#F5C542]">Shop</Link><ChevronRight size={13} />
        <Link href={`/shop?cat=${p.category}`} className="hover:text-[#F5C542] capitalize hidden sm:inline">{p.category.replace("-", " ")}</Link>
        <ChevronRight size={13} className="hidden sm:block" />
        <span className="text-white/80 truncate">{p.name}</span>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-2 gap-10">
        {/* gallery */}
        <div className="animate-fadeUp">
          <div
            className="relative rounded-3xl overflow-hidden border border-white/10 bg-black cursor-zoom-in group"
            onClick={() => setZoom((v) => !v)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.images[img]}
              alt={`${p.name} image ${img + 1}`}
              className={cn("w-full aspect-square object-cover transition-transform duration-500", zoom ? "scale-150" : "group-hover:scale-105")}
            />
            <span className="absolute bottom-4 right-4 flex items-center gap-1.5 text-[12px] font-bold bg-black/70 backdrop-blur px-3 py-1.5 rounded-full border border-white/15"><ZoomIn size={13} className="text-[#F5C542]" /> {zoom ? "Click to reset" : "Click to zoom"}</span>
            {discount > 0 && <span className="absolute top-4 left-4 gold-bg text-black text-[13px] font-black px-3 py-1.5 rounded-full">SAVE {discount}%</span>}
          </div>
          <div className="flex gap-3 mt-3">
            {p.images.map((src, i) => (
              <button key={i} onClick={() => { setImg(i); setZoom(false); }} aria-label={`View image ${i + 1}`} className={cn("w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all", i === img ? "border-[#F5C542] shadow-[0_0_16px_rgba(245,197,66,.4)]" : "border-white/10 opacity-60 hover:opacity-100")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* info */}
        <div className="animate-fadeUp" style={{ animationDelay: "100ms" }}>
          <p className="text-[11px] font-bold tracking-[0.25em] text-[#F5C542] uppercase">{p.brand} • <span className="capitalize">{p.category.replace("-", " ")}</span></p>
          <h1 className="font-display font-black text-3xl sm:text-4xl leading-tight mt-2">{p.name}</h1>
          <p className="text-white/55 mt-1.5">{p.tagline}</p>
          <div className="flex items-center gap-2.5 mt-3">
            <Stars rating={p.rating} size={16} />
            <span className="text-sm text-white/60">{p.rating} • {p.reviewsCount.toLocaleString()} verified reviews • {p.soldCount.toLocaleString()}+ sold</span>
          </div>
          <div className="flex items-baseline gap-3 mt-5">
            <span className="font-display font-black text-4xl gold-text">{formatPrice(p.price)}</span>
            {p.compareAt && <span className="text-lg text-white/35 line-through">{formatPrice(p.compareAt)}</span>}
            {discount > 0 && <span className="text-[12px] font-black bg-green-500/15 text-green-400 border border-green-500/30 px-2.5 py-1 rounded-full">YOU SAVE {formatPrice(p.compareAt! - p.price)}</span>}
          </div>
          <p className="text-[13px] text-white/50 mt-2">or 4 interest-free payments of {formatPrice(p.price / 4)} • Tax included</p>

          {/* variants */}
          {p.colors && (
            <div className="mt-6">
              <p className="text-[13px] font-bold mb-2.5">Color: <span className="text-[#F5C542]">{p.colors[color].name}</span></p>
              <div className="flex gap-2.5">
                {p.colors.map((c, i) => (
                  <button key={c.name} onClick={() => setColor(i)} aria-label={c.name} title={c.name} className={cn("w-10 h-10 rounded-full border-2 transition-all grid place-items-center", i === color ? "border-[#F5C542] scale-110 shadow-[0_0_14px_rgba(245,197,66,.5)]" : "border-white/20 hover:border-white/50")} style={{ background: c.hex }}>
                    {i === color && <Check size={15} className="text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>
          )}
          {p.sizes && (
            <div className="mt-5">
              <p className="text-[13px] font-bold mb-2.5">Option: <span className="text-[#F5C542]">{p.sizes[size]}</span></p>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s, i) => (
                  <button key={s} onClick={() => setSize(i)} className={cn("px-5 py-2.5 rounded-xl text-[13px] font-bold border transition-all", i === size ? "gold-bg text-black border-transparent" : "border-white/15 text-white/70 hover:border-[#F5C542]/50")}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* qty + stock */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center gap-3 bg-[#1A1A1A] border border-white/12 rounded-full px-2 py-2">
              <button onClick={() => setQty((v) => Math.max(1, v - 1))} className="w-8 h-8 grid place-items-center rounded-full hover:bg-white/10" aria-label="Decrease quantity"><Minus size={15} /></button>
              <span className="font-black w-6 text-center tabular-nums">{qty}</span>
              <button onClick={() => setQty((v) => Math.min(99, v + 1))} className="w-8 h-8 grid place-items-center rounded-full hover:bg-white/10" aria-label="Increase quantity"><Plus size={15} /></button>
            </div>
            <p className={cn("text-[13px] font-bold flex items-center gap-1.5", p.stock <= 30 ? "text-orange-300" : "text-green-400")}>
              <span className={cn("w-2 h-2 rounded-full animate-pulse", p.stock <= 30 ? "bg-orange-400" : "bg-green-400")} />
              {p.stock <= 30 ? `Only ${p.stock} left — order soon` : "In stock, ships in 24h"}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 mt-5">
            <button onClick={() => addToCart(p, qty, variant || undefined)} className="flex-1 gold-btn rounded-2xl py-4 text-[15px] flex items-center justify-center gap-2"><ShoppingBag size={18} /> Add to Cart</button>
            <button onClick={() => toggleWishlist(p.slug)} aria-label="Toggle wishlist" className={cn("w-[58px] grid place-items-center rounded-2xl border transition-all", wished ? "bg-[#F5C542] text-black border-transparent shadow-[0_0_20px_rgba(245,197,66,.5)]" : "border-white/15 text-white/70 hover:text-[#F5C542] hover:border-[#F5C542]/50")}><Heart size={20} className={wished ? "fill-black" : ""} /></button>
          </div>
          <button onClick={buyNow} className="w-full mt-3 rounded-2xl py-4 text-[15px] font-black bg-white text-black hover:bg-[#F5C542] transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(245,197,66,.5)]"><Zap size={18} /> Buy Now — Fast Checkout</button>

          {/* trust */}
          <div className="grid grid-cols-3 gap-2.5 mt-6">
            {[
              { icon: Truck, t: "Free ship $75+", s: "2–4 day delivery" },
              { icon: ShieldCheck, t: "12-mo warranty", s: "7-day DOA cover" },
              { icon: RotateCcw, t: "30-day returns", s: "No questions" },
            ].map((b) => (
              <div key={b.t} className="bg-[#141414] border border-white/8 rounded-2xl p-3.5 text-center">
                <b.icon size={18} className="mx-auto text-[#F5C542]" />
                <p className="text-[12px] font-bold mt-1.5">{b.t}</p>
                <p className="text-[11px] text-white/45">{b.s}</p>
              </div>
            ))}
          </div>
          <p className="flex items-center justify-center gap-1.5 text-[12px] text-white/45 mt-4"><Lock size={12} className="text-green-400" /> Secure 256-bit SSL checkout • Visa • Mastercard • PayPal • Apple Pay</p>
        </div>
      </div>

      {/* tabs */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-8">
        <Reveal>
          <div className="bg-[#141414] border border-white/8 rounded-3xl overflow-hidden">
            <div className="flex overflow-x-auto border-b border-white/8" role="tablist">
              {[["details", "Details"], ["specs", "Specifications"], ["reviews", `Reviews (${p.reviewsCount.toLocaleString()})`], ["shipping", "Shipping & Returns"]].map(([key, label]) => (
                <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key as typeof tab)} className={cn("px-6 sm:px-8 py-4 text-[13px] sm:text-sm font-bold whitespace-nowrap border-b-2 transition-all", tab === key ? "border-[#F5C542] text-[#F5C542]" : "border-transparent text-white/55 hover:text-white")}>
                  {label}
                </button>
              ))}
            </div>
            <div className="p-6 sm:p-10">
              {tab === "details" && (
                <div className="max-w-3xl">
                  <p className="text-white/70 leading-relaxed">{p.description}</p>
                  <ul className="grid sm:grid-cols-2 gap-2.5 mt-6">
                    {["100% genuine, sealed box", "Quality-tested before dispatch", "12-month BabaG7Star warranty", "Free 30-day returns", "Live tracking on every order", "Secure encrypted checkout"].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-white/70"><Check size={15} className="text-[#F5C542] shrink-0" /> {f}</li>
                    ))}
                  </ul>
                </div>
              )}
              {tab === "specs" && (
                <dl className="max-w-3xl divide-y divide-white/8">
                  {Object.entries(p.specs).map(([k, v]) => (
                    <div key={k} className="grid sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 py-3.5">
                      <dt className="text-[13px] font-bold tracking-wide text-[#F5C542] uppercase">{k}</dt>
                      <dd className="text-sm text-white/75">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {tab === "reviews" && (
                <div className="grid lg:grid-cols-[280px_1fr] gap-8">
                  <div className="bg-black/40 border border-white/8 rounded-2xl p-6 text-center h-fit">
                    <p className="font-display font-black text-5xl gold-text">{p.rating}</p>
                    <Stars rating={p.rating} size={17} className="justify-center mt-2" />
                    <p className="text-[13px] text-white/50 mt-2">{p.reviewsCount.toLocaleString()} verified reviews</p>
                    <div className="mt-4 space-y-1.5">
                      {[[5, 78], [4, 15], [3, 4], [2, 2], [1, 1]].map(([s, pct]) => (
                        <div key={s} className="flex items-center gap-2 text-[12px] text-white/50">
                          <span className="w-6">{s}★</span>
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full gold-bg rounded-full" style={{ width: `${pct}%` }} /></div>
                          <span className="w-8 text-right">{pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {reviews.map((r, i) => (
                      <div key={i} className="bg-black/40 border border-white/8 rounded-2xl p-5">
                        <div className="flex items-center gap-2"><Stars rating={r.stars} size={14} /><span className="text-[13px] font-bold">{r.title}</span></div>
                        <p className="text-sm text-white/65 mt-2 leading-relaxed">{r.body}</p>
                        <p className="text-[12px] text-white/40 mt-3">— {r.name} <span className="text-green-400">✓ Verified purchase</span></p>
                      </div>
                    ))}
                    <p className="text-[13px] text-white/45">Reviews are collected post-delivery. To write one, finish checkout — we email every buyer. (API: <code className="text-[#F5C542]">/api/reviews</code>)</p>
                  </div>
                </div>
              )}
              {tab === "shipping" && (
                <div className="max-w-3xl grid sm:grid-cols-2 gap-4">
                  {[
                    ["Standard (2–4 days)", "Free over $75, else $4.95. Tracked, insured."],
                    ["Express (1–2 days)", "$9.95, free over $150. Priority handling."],
                    ["30-day returns", "Unused + sealed = full refund. Prepaid label for faults."],
                    ["Warranty", "12 months included. 7-day DOA instant replacement."],
                  ].map(([t, d]) => (
                    <div key={t} className="bg-black/40 border border-white/8 rounded-2xl p-5">
                      <p className="font-bold text-sm">{t}</p>
                      <p className="text-[13px] text-white/55 mt-1.5">{d}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {/* related */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display font-black text-2xl sm:text-3xl">Pairs well <span className="gold-text">with</span></h2>
          <Link href="/shop" className="text-[13px] font-bold text-[#F5C542] flex items-center gap-1">View all <ChevronRight size={15} /></Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-6">
          {related.map((r, i) => <ProductCard key={r.slug} product={r} index={i} />)}
        </div>
      </div>

      {/* JSON-LD for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description, brand: p.brand, aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviewsCount }, offers: { "@type": "Offer", price: p.price, priceCurrency: "USD", availability: "https://schema.org/InStock" } }) }} />
    </div>
  );
}
