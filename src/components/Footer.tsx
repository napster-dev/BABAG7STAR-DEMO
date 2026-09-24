"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, ShieldCheck, Lock, RotateCcw, MapPin, Mail, Phone, Check, Globe, AtSign, Share2, Play } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setState("error"); setMsg("Please enter a valid email."); return; }
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source: "footer" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setState("done"); setMsg(data.message || "Welcome to the Star Club! Code B7STAR10 unlocked.");
    } catch (err: unknown) {
      setState("error"); setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <footer className="bg-[#080808] border-t border-[#D4A017]/20 mt-0">
      {/* newsletter strip */}
      <div className="border-b border-white/8 bg-gradient-to-r from-[#141000] via-[#1a1405] to-[#141000]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1 text-center lg:text-left">
            <p className="text-[11px] font-bold tracking-[0.3em] text-[#F5C542]">★ STAR CLUB — GET 10% OFF</p>
            <h3 className="font-display font-black text-2xl sm:text-3xl mt-2">Join 40,000+ insiders. <span className="gold-text">Never miss a drop.</span></h3>
            <p className="text-white/55 text-sm mt-2">Early access to flash sales, new gadgets & members-only prices. No spam, unsubscribe anytime.</p>
          </div>
          <form onSubmit={subscribe} className="w-full max-w-md">
            <div className="flex items-center bg-[#0B0B0B] border border-white/15 rounded-full p-1.5 pl-5 focus-within:border-[#F5C542]/70 transition-all">
              <Mail size={17} className="text-white/40 shrink-0" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="bg-transparent flex-1 px-3 text-sm focus:outline-none placeholder:text-white/35" aria-label="Email for newsletter" />
              <button disabled={state === "loading"} className="gold-btn rounded-full px-5 py-2.5 text-[13px] flex items-center gap-2 disabled:opacity-60">
                {state === "loading" ? "Joining…" : state === "done" ? <><Check size={15} /> Joined</> : <><Send size={14} /> Get 10% Off</>}
              </button>
            </div>
            {msg && <p className={`text-[13px] mt-2 ${state === "done" ? "text-green-400" : state === "error" ? "text-red-400" : "text-white/50"}`}>{msg}</p>}
          </form>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div className="col-span-2 lg:col-span-2">
          <Logo />
          <p className="text-white/55 text-sm leading-relaxed mt-4 max-w-sm">Premium electronics, smart gadgets & lifestyle essentials — curated for speed, quality and style. Shipped fast, backed by a 12-month warranty and 30-day returns.</p>
          <div className="flex gap-2.5 mt-5">
            {[Globe, AtSign, Share2, Play].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="w-10 h-10 grid place-items-center rounded-full bg-[#1A1A1A] border border-white/10 text-white/70 hover:text-black hover:gold-bg hover:border-transparent hover:shadow-[0_0_20px_rgba(245,197,66,.5)] transition-all hover:bg-[#F5C542]">
                <Icon size={17} />
              </a>
            ))}
          </div>
          <div className="mt-5 space-y-1.5 text-[13px] text-white/55">
            <p className="flex items-center gap-2"><MapPin size={14} className="text-[#F5C542]" /> 7 Star Avenue, Tech District, New York, NY</p>
            <p className="flex items-center gap-2"><Mail size={14} className="text-[#F5C542]" /> support@babag7star.com</p>
            <p className="flex items-center gap-2"><Phone size={14} className="text-[#F5C542]" /> +1 (800) 7STAR-07</p>
          </div>
        </div>
        <div>
          <h4 className="font-display font-bold text-sm tracking-widest text-[#F5C542] mb-4">SHOP</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li><Link className="hover:text-[#F5C542]" href="/shop">All Products</Link></li>
            <li><Link className="hover:text-[#F5C542]" href="/shop?cat=electronics">Electronics</Link></li>
            <li><Link className="hover:text-[#F5C542]" href="/shop?cat=smart-gadgets">Smart Gadgets</Link></li>
            <li><Link className="hover:text-[#F5C542]" href="/shop?cat=home-living">Home & Living</Link></li>
            <li><Link className="hover:text-[#F5C542]" href="/shop?cat=accessories">Accessories</Link></li>
            <li><Link className="hover:text-[#F5C542]" href="/shop?sort=newest">New Arrivals</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-sm tracking-widest text-[#F5C542] mb-4">SUPPORT</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li><Link className="hover:text-[#F5C542]" href="/contact">Contact Us</Link></li>
            <li><Link className="hover:text-[#F5C542]" href="/faq">FAQ</Link></li>
            <li><Link className="hover:text-[#F5C542]" href="/shipping">Shipping & Returns</Link></li>
            <li><Link className="hover:text-[#F5C542]" href="/account">Track Order</Link></li>
            <li><Link className="hover:text-[#F5C542]" href="/wishlist">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-sm tracking-widest text-[#F5C542] mb-4">COMPANY</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li><Link className="hover:text-[#F5C542]" href="/about">About Us</Link></li>
            <li><Link className="hover:text-[#F5C542]" href="/privacy">Privacy Policy</Link></li>
            <li><Link className="hover:text-[#F5C542]" href="/terms">Terms & Conditions</Link></li>
            <li><Link className="hover:text-[#F5C542]" href="/login">Login / Register</Link></li>
          </ul>
          <div className="flex flex-wrap gap-1.5 mt-5">
            {["VISA", "MC", "AMEX", "PayPal", "Apple Pay", "G Pay"].map((p) => (
              <span key={p} className="text-[10px] font-black tracking-wider bg-[#1A1A1A] border border-white/12 rounded-md px-2 py-1 text-white/70">{p}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-white/45">
          <p>© 2026 BabaG7Star. All rights reserved. Crafted for the fast & fearless.</p>
          <p className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Lock size={13} className="text-green-400" /> 256-bit SSL Secure</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-[#F5C542]" /> Buyer Protection</span>
            <span className="flex items-center gap-1.5"><RotateCcw size={13} className="text-[#F5C542]" /> 30-Day Returns</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
