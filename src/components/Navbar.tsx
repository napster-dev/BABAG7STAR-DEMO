"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingBag, Heart, User, Menu, X, Zap, ChevronRight, Truck } from "lucide-react";
import Logo from "./Logo";
import { useStore } from "@/store/StoreContext";
import { PRODUCTS, formatPrice } from "@/data/products";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?cat=electronics", label: "Electronics" },
  { href: "/shop?cat=smart-gadgets", label: "Gadgets" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { cartCount, wishlist, setCartOpen, setQuickView } = useStore();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const suggestions = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2) return [];
    return PRODUCTS.filter((p) => (p.name + " " + p.category + " " + p.brand).toLowerCase().includes(needle)).slice(0, 6);
  }, [q]);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-[#8a6500] via-[#D4A017] to-[#8a6500] text-black text-center text-[12px] sm:text-[13px] font-bold tracking-wide py-2 px-4 relative z-[60]">
        <span className="inline-flex items-center gap-2 flex-wrap justify-center">
          <Truck size={15} strokeWidth={2.5} />
          FREE EXPRESS SHIPPING OVER $75
          <span className="hidden sm:inline opacity-60">•</span>
          <span className="hidden sm:inline">EXTRA 10% OFF FIRST ORDER: <span className="bg-black text-[#F5C542] px-2 py-0.5 rounded-md ml-1 tracking-widest">B7STAR10</span></span>
        </span>
      </div>

      <header className={cn("sticky top-0 z-50 border-b transition-all duration-300", scrolled ? "bg-[#0B0B0B]/92 backdrop-blur-xl border-[#D4A017]/20 shadow-[0_8px_40px_rgba(0,0,0,.6)]" : "bg-[#0B0B0B] border-white/10")}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-6 h-[72px]">
            {/* mobile menu */}
            <button className="lg:hidden p-2 -ml-2 text-white/80 hover:text-[#F5C542]" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link href="/" aria-label="BabaG7Star home"><Logo /></Link>

            {/* search desktop */}
            <div ref={boxRef} className="hidden md:block flex-1 max-w-xl relative">
              <div className="flex items-center bg-[#1A1A1A] border border-white/12 rounded-full pl-4 pr-1.5 py-1.5 focus-within:border-[#F5C542]/70 focus-within:shadow-[0_0_24px_rgba(245,197,66,.18)] transition-all">
                <Search size={18} className="text-white/40 shrink-0" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) { router.push(`/shop?q=${encodeURIComponent(q.trim())}`); setFocused(false); } }}
                  placeholder="Search phones, earbuds, drones, chargers…"
                  className="bg-transparent flex-1 px-3 text-sm placeholder:text-white/35 focus:outline-none"
                  aria-label="Search products"
                />
                <button onClick={() => q.trim() && router.push(`/shop?q=${encodeURIComponent(q.trim())}`)} className="gold-btn rounded-full px-5 py-2 text-[13px]">Search</button>
              </div>
              {focused && suggestions.length > 0 && (
                <div className="absolute top-[110%] left-0 right-0 bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-fadeIn">
                  {suggestions.map((p) => (
                    <button
                      key={p.slug}
                      onClick={() => { setFocused(false); setQ(""); setQuickView(p); }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-white/5 text-left"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.images[0]} alt={p.name} className="w-11 h-11 rounded-xl object-cover" loading="lazy" />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-semibold truncate">{p.name}</span>
                        <span className="block text-xs text-white/50 capitalize">{p.category} • {p.rating}★</span>
                      </span>
                      <span className="text-[#F5C542] font-bold text-sm">{formatPrice(p.price)}</span>
                    </button>
                  ))}
                  <button onClick={() => { router.push(`/shop?q=${encodeURIComponent(q)}`); setFocused(false); }} className="w-full text-center text-[13px] font-bold text-[#F5C542] py-3 bg-[#D4A017]/10 hover:bg-[#D4A017]/20">
                    View all results for “{q}” →
                  </button>
                </div>
              )}
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-[14px] font-semibold text-white/70 ml-auto">
              {LINKS.slice(0, 5).map((l) => (
                <Link key={l.href + l.label} href={l.href} className={cn("hover:text-[#F5C542] transition-colors relative group", pathname === l.href && "text-[#F5C542]")}>
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-[#D4A017] to-[#F5C542] group-hover:w-full transition-all" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2 ml-auto lg:ml-0">
              <Link href="/wishlist" className="relative p-2.5 rounded-full hover:bg-white/8 text-white/80 hover:text-[#F5C542] transition-colors" aria-label="Wishlist">
                <Heart size={21} />
                {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[19px] h-[19px] px-1 grid place-items-center rounded-full gold-bg text-black text-[11px] font-black">{wishlist.length}</span>}
              </Link>
              <Link href="/account" className="p-2.5 rounded-full hover:bg-white/8 text-white/80 hover:text-[#F5C542] transition-colors" aria-label="Account">
                <User size={21} />
              </Link>
              <button onClick={() => setCartOpen(true)} className="relative p-2.5 rounded-full hover:bg-white/8 text-white/80 hover:text-[#F5C542] transition-colors" aria-label="Cart">
                <ShoppingBag size={21} />
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[19px] h-[19px] px-1 grid place-items-center rounded-full gold-bg text-black text-[11px] font-black animate-pulse">{cartCount}</span>}
              </button>
            </div>
          </div>

          {/* search mobile */}
          <div className="md:hidden pb-3">
            <div className="flex items-center bg-[#1A1A1A] border border-white/12 rounded-full pl-4 pr-1.5 py-1.5">
              <Search size={17} className="text-white/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && q.trim() && router.push(`/shop?q=${encodeURIComponent(q.trim())}`)}
                placeholder="Search products…"
                className="bg-transparent flex-1 px-3 text-sm placeholder:text-white/35 focus:outline-none"
                aria-label="Search products"
              />
              <button onClick={() => q.trim() && router.push(`/shop?q=${encodeURIComponent(q.trim())}`)} className="gold-btn rounded-full p-2.5" aria-label="Search"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0e0e0e] px-5 py-4 space-y-1 animate-fadeIn">
            {[...LINKS, { href: "/wishlist", label: "Wishlist" }, { href: "/faq", label: "FAQ" }, { href: "/shipping", label: "Shipping & Returns" }].map((l) => (
              <Link key={l.label} href={l.href} className="flex items-center justify-between py-2.5 text-[15px] font-semibold text-white/80 hover:text-[#F5C542] border-b border-white/5 last:border-0">
                {l.label}<ChevronRight size={16} className="text-white/30" />
              </Link>
            ))}
            <Link href="/shop" className="gold-btn rounded-xl flex items-center justify-center gap-2 py-3 mt-3 text-sm"><Zap size={16} /> SHOP NOW — UP TO 40% OFF</Link>
          </div>
        )}
      </header>
    </>
  );
}
