"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap, Truck, ShieldCheck, RotateCcw, Lock, ChevronLeft, ChevronRight, Flame, Star, BadgeCheck, Timer } from "lucide-react";
import { PRODUCTS, CATEGORIES, TESTIMONIALS, formatPrice } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { SectionHeading, Stars, Reveal, useRevealAll } from "@/components/UI";
import { useStore } from "@/store/StoreContext";

function useCountdown() {
  const [t, setT] = useState({ h: 11, m: 42, s: 18 });
  useEffect(() => {
    const id = setInterval(() => {
      setT((prev) => {
        let { h, m, s } = prev;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h = h > 0 ? h - 1 : 23; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function HomeClient() {
  useRevealAll();
  const { addToCart } = useStore();
  const trendingRef = useRef<HTMLDivElement>(null);
  const count = useCountdown();
  const trending = PRODUCTS.filter((p) => p.isTrending);
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);
  const heroProduct = PRODUCTS[0];

  const scrollTrending = (dir: 1 | -1) => {
    trendingRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="bg-[#0B0B0B]">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden noise">
        <div className="absolute inset-0 hero-grid" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#D4A017]/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-20 -left-32 w-96 h-96 bg-[#D4A017]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-14 grid lg:grid-cols-2 gap-10 items-center">
          {/* copy */}
          <div className="animate-fadeUp">
            <div className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#F5C542]/30 rounded-full pl-1.5 pr-4 py-1.5 text-[12px] font-bold">
              <span className="gold-bg text-black rounded-full px-2.5 py-1 text-[11px] flex items-center gap-1"><Flame size={12} /> NEW DROP</span>
              <span className="text-white/80">Nova X9 Pro 5G — now 27% off</span>
            </div>
            <h1 className="font-display font-black text-[42px] sm:text-6xl lg:text-[68px] leading-[0.95] tracking-tight mt-6">
              PREMIUM TECH.
              <br />
              <span className="gold-text">STREET ENERGY.</span>
              <br />
              <span className="text-white">STAR SPEED.</span>
            </h1>
            <p className="text-white/60 text-[15px] sm:text-lg leading-relaxed mt-5 max-w-lg">
              Flagship phones, concert-grade audio, smart gadgets & home tech — curated, quality-checked and shipped at star speed. Trusted by <span className="text-[#F5C542] font-bold">40,000+ happy customers</span>.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/shop" className="gold-btn rounded-full px-8 py-4 text-[15px] flex items-center gap-2">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link href="/shop?cat=smart-gadgets" className="ghost-btn rounded-full px-8 py-4 text-[15px] font-bold flex items-center gap-2 text-white">
                <Zap size={17} className="text-[#F5C542]" /> Explore Gadgets
              </Link>
            </div>
            {/* stats */}
            <div className="flex gap-8 mt-9">
              {[
                ["40K+", "Happy customers"],
                ["4.8★", "Average rating"],
                ["24H", "Fast dispatch"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display font-black text-2xl gold-text">{v}</p>
                  <p className="text-[12px] text-white/50 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
            {/* trust mini */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-7 text-[12px] text-white/50">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#F5C542]" /> 12-month warranty</span>
              <span className="flex items-center gap-1.5"><Truck size={14} className="text-[#F5C542]" /> Free ship $75+</span>
              <span className="flex items-center gap-1.5"><Lock size={14} className="text-[#F5C542]" /> Secure checkout</span>
            </div>
          </div>

          {/* visual */}
          <div className="relative animate-fadeUp" style={{ animationDelay: "150ms" }}>
            <div className="relative rounded-[28px] overflow-hidden border border-[#D4A017]/30 shadow-[0_30px_100px_rgba(0,0,0,.7),0_0_60px_rgba(212,160,23,.15)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.pexels.com/photos/38691715/pexels-photo-38691715.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                alt="BabaG7Star premium tech collection in gold light"
                className="w-full h-[420px] sm:h-[520px] object-cover"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              {/* floating product card */}
              <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-[#101010]/90 backdrop-blur-xl border border-white/12 rounded-2xl p-4 flex items-center gap-4 max-w-sm animate-floaty">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroProduct.images[0]} alt={heroProduct.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold tracking-widest text-[#F5C542]">BEST SELLER</p>
                  <p className="font-bold text-sm truncate">{heroProduct.name}</p>
                  <p className="text-[13px]"><span className="gold-text font-black">{formatPrice(heroProduct.price)}</span> <span className="line-through text-white/35 ml-1">{formatPrice(heroProduct.compareAt!)}</span></p>
                </div>
                <button onClick={() => addToCart(heroProduct)} className="gold-btn rounded-xl px-4 py-2.5 text-[12px] shrink-0">Add +</button>
              </div>
              {/* rating pill */}
              <div className="absolute top-5 right-5 bg-black/70 backdrop-blur border border-[#F5C542]/40 rounded-full px-4 py-2 flex items-center gap-2 text-[13px] font-bold">
                <Star size={14} className="fill-[#F5C542] text-[#F5C542]" /> 4.8 <span className="font-normal text-white/60">• 12k reviews</span>
              </div>
            </div>
            {/* side floating thumbs */}
            <div className="hidden sm:flex absolute -left-8 top-10 flex-col gap-3">
              {PRODUCTS.slice(2, 4).map((p) => (
                <Link key={p.slug} href={`/product/${p.slug}`} className="w-[92px] rounded-2xl overflow-hidden border border-white/15 shadow-xl hover:border-[#F5C542]/60 transition-all hover:scale-105 bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images[0]} alt={p.name} className="w-full h-[92px] object-cover" loading="lazy" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* marquee */}
        <div className="relative border-y border-[#D4A017]/20 bg-[#0e0c04] py-3.5 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee gap-0 w-max">
            {[0, 1].map((k) => (
              <div key={k} className="flex items-center gap-8 pr-8 text-[13px] font-black tracking-[0.2em] text-[#F5C542]/90">
                {["FREE EXPRESS SHIPPING OVER $75", "★ 30-DAY RETURNS", "12-MONTH WARRANTY", "SECURE CHECKOUT", "NEW DROPS WEEKLY", "EXTRA 10% OFF: B7STAR10"].map((t) => (
                  <span key={t + k} className="flex items-center gap-8"><span>{t}</span><span className="text-white/20">◆</span></span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRENDING CAROUSEL ============ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading align="left" eyebrow="Trending now" title={<>On fire this week <span className="gold-text">🔥</span></>} sub="Most-wanted gadgets, restocked and moving fast." />
          <div className="hidden sm:flex gap-2 shrink-0">
            <button onClick={() => scrollTrending(-1)} className="w-11 h-11 grid place-items-center rounded-full border border-white/15 hover:border-[#F5C542]/60 hover:text-[#F5C542]" aria-label="Scroll left"><ChevronLeft size={19} /></button>
            <button onClick={() => scrollTrending(1)} className="w-11 h-11 grid place-items-center rounded-full gold-bg text-black" aria-label="Scroll right"><ChevronRight size={19} /></button>
          </div>
        </div>
        <div ref={trendingRef} className="flex gap-4 sm:gap-5 overflow-x-auto pb-2 mt-8 snap-x snap-mandatory scrollbar-none" style={{ scrollbarWidth: "none" }}>
          {trending.map((p, i) => (
            <div key={p.slug} className="min-w-[240px] sm:min-w-[280px] snap-start"><ProductCard product={p} index={i} /></div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/shop?sort=trending" className="ghost-btn inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white">View all trending <ArrowRight size={16} className="text-[#F5C542]" /></Link>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="bg-[#0e0e0e] border-y border-white/8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <SectionHeading eyebrow="Shop by vibe" title={<>Find your <span className="gold-text">lane</span></>} sub="Six curated worlds — from flagship electronics to everyday upgrades." />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-10">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 3) * 90}>
                <Link href={c.slug === "new-arrivals" ? "/shop?sort=newest" : c.slug === "best-sellers" ? "/shop?sort=popular" : `/shop?cat=${c.slug}`} className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-[#F5C542]/50 transition-all card-hover block h-[190px] sm:h-[240px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt={`${c.name} category`} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[11px] font-bold tracking-[0.22em] text-[#F5C542]">{c.count} PRODUCTS</p>
                    <h3 className="font-display font-black text-xl sm:text-2xl mt-1">{c.name}</h3>
                    <p className="text-white/55 text-[13px] mt-0.5">{c.blurb}</p>
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#F5C542] mt-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">Shop now <ArrowRight size={14} /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FLASH DEAL ============ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <Reveal>
          <div className="relative rounded-[28px] overflow-hidden border border-[#D4A017]/30 bg-gradient-to-br from-[#1c1503] via-[#12100a] to-[#0B0B0B] p-8 sm:p-12 grid lg:grid-cols-2 gap-8 items-center">
            <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#F5C542]/15 blur-[100px] rounded-full" />
            <div>
              <p className="inline-flex items-center gap-2 text-[12px] font-black tracking-[0.25em] text-black gold-bg rounded-full px-4 py-1.5"><Timer size={14} /> FLASH DEAL ENDS SOON</p>
              <h2 className="font-display font-black text-3xl sm:text-5xl leading-tight mt-5">Up to <span className="gold-text">40% off</span> flagship audio & wearables</h2>
              <p className="text-white/60 mt-3">AuraBuds Pro, AeroPods Max & PulseFit S2 — lowest prices of the season. When the timer hits zero, prices go back up.</p>
              <div className="flex gap-3 mt-6">
                {[[pad(count.h), "HRS"], [pad(count.m), "MIN"], [pad(count.s), "SEC"]].map(([v, l]) => (
                  <div key={l} className="bg-black/70 border border-[#F5C542]/30 rounded-2xl w-[76px] py-3 text-center">
                    <p className="font-display font-black text-2xl gold-text tabular-nums">{v}</p>
                    <p className="text-[10px] tracking-[0.25em] text-white/50 font-bold">{l}</p>
                  </div>
                ))}
              </div>
              <Link href="/shop?sort=discount" className="gold-btn inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm mt-7">Grab the deal <ArrowRight size={16} /></Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {PRODUCTS.slice(1, 5).map((p) => (
                <Link key={p.slug} href={`/product/${p.slug}`} className="group rounded-2xl overflow-hidden border border-white/10 bg-black hover:border-[#F5C542]/50 transition-all">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images[0]} alt={p.name} loading="lazy" className="h-32 sm:h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="p-3">
                    <p className="text-[13px] font-bold truncate">{p.name}</p>
                    <p className="text-[13px] mt-0.5"><span className="gold-text font-black">{formatPrice(p.price)}</span> <span className="line-through text-white/30 text-[12px] ml-1">{p.compareAt && formatPrice(p.compareAt)}</span></p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ BEST SELLERS ============ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-14 sm:pb-20">
        <SectionHeading eyebrow="Customer favorites" title={<>Best <span className="gold-text">sellers</span></>} sub="Thousands of 5-star reviews can't be wrong. The icons of the Star catalog." />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-10">
          {bestSellers.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      </section>

      {/* ============ WHY US ============ */}
      <section className="bg-[#0e0e0e] border-y border-white/8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <SectionHeading eyebrow="Why BabaG7Star" title={<>Shopping that feels <span className="gold-text">first-class</span></>} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-10">
            {[
              { icon: Truck, t: "Star-Speed Shipping", d: "Same-day dispatch before 2pm. Free express over $75 with live tracking on every order." },
              { icon: Lock, t: "Secure Checkout", d: "256-bit SSL encryption, PayPal & card protection. Your data never touches our servers raw." },
              { icon: BadgeCheck, t: "Quality Guaranteed", d: "Every gadget is tested & quality-checked. 12-month warranty + 7-day DOA replacement." },
              { icon: RotateCcw, t: "Easy 30-Day Returns", d: "Changed your mind? No drama. Free return label, refund in 48 hours after inspection." },
            ].map((f, i) => (
              <Reveal key={f.t} delay={i * 90}>
                <div className="rounded-3xl bg-[#141414] border border-white/8 p-7 card-hover h-full hover:border-[#F5C542]/40">
                  <div className="w-12 h-12 rounded-2xl gold-bg grid place-items-center text-black shadow-[0_0_24px_rgba(245,197,66,.35)]"><f.icon size={22} /></div>
                  <h3 className="font-display font-bold text-lg mt-5">{f.t}</h3>
                  <p className="text-white/55 text-sm leading-relaxed mt-2">{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <SectionHeading eyebrow="Wall of love" title={<>40,000+ shoppers. <span className="gold-text">4.8 average.</span></>} sub="Real reviews from verified buyers across phones, audio, drones & home tech." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-10">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 90}>
              <figure className="rounded-3xl bg-[#141414] border border-white/8 p-6 card-hover h-full hover:border-[#F5C542]/35">
                <Stars rating={t.rating} size={15} />
                <blockquote className="text-[14px] text-white/75 leading-relaxed mt-3">“{t.text}”</blockquote>
                <figcaption className="flex items-center gap-3 mt-5">
                  <span className="w-11 h-11 rounded-full gold-bg grid place-items-center text-black font-black text-sm">{t.avatar}</span>
                  <span>
                    <span className="block font-bold text-sm">{t.name}</span>
                    <span className="block text-[12px] text-[#F5C542]/80">{t.role}</span>
                  </span>
                  <BadgeCheck size={17} className="ml-auto text-green-400" />
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <Reveal>
          <div className="relative rounded-[28px] overflow-hidden border border-[#D4A017]/30 text-center px-6 py-14 sm:py-16 bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.pexels.com/photos/236086/pexels-photo-236086.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
            <div className="relative">
              <p className="text-[11px] font-black tracking-[0.3em] text-[#F5C542]">★ READY TO JOIN THE STAR CLUB?</p>
              <h2 className="font-display font-black text-3xl sm:text-5xl mt-3">Your next favorite gadget<br />is <span className="gold-text">one click away.</span></h2>
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <Link href="/shop" className="gold-btn rounded-full px-9 py-4 text-[15px] inline-flex items-center gap-2">Shop the Collection <ArrowRight size={17} /></Link>
                <Link href="/about" className="ghost-btn rounded-full px-9 py-4 text-[15px] font-bold text-white">Our Story</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
