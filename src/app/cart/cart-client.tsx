"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, Tag, Lock, Truck, ShieldCheck, ShoppingBag } from "lucide-react";
import { useStore } from "@/store/StoreContext";
import { PRODUCTS, formatPrice } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const PROMOS: Record<string, number> = { B7STAR10: 0.1, STAR15: 0.15, WELCOME5: 0.05 };

export default function CartClient() {
  const { cart, updateQty, removeFromCart, subtotal, promo, setPromo, showToast } = useStore();
  const [code, setCode] = useState(promo ?? "");
  const [error, setError] = useState("");

  const discountRate = promo && PROMOS[promo] ? PROMOS[promo] : 0;
  const discount = subtotal * discountRate;
  const shipping = subtotal === 0 ? 0 : subtotal - discount >= 75 ? 0 : 4.95;
  const total = Math.max(0, subtotal - discount + shipping);

  const apply = () => {
    const c = code.trim().toUpperCase();
    if (PROMOS[c]) {
      setPromo(c);
      setError("");
      showToast(`Promo ${c} applied — ${PROMOS[c] * 100}% off`);
    } else {
      setError("Invalid code. Try B7STAR10 for 10% off.");
    }
  };

  const suggestions = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-[#1A1A1A] grid place-items-center border border-white/10"><ShoppingBag size={36} className="text-white/30" /></div>
        <h1 className="font-display font-black text-3xl mt-6">Your cart is empty</h1>
        <p className="text-white/55 mt-2">Fill it with something brilliant — trending gadgets are waiting.</p>
        <Link href="/shop" className="gold-btn rounded-full px-9 py-4 text-sm inline-flex items-center gap-2 mt-7">Continue Shopping <ArrowRight size={16} /></Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0B0B] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-display font-black text-3xl sm:text-4xl">Your <span className="gold-text">Cart</span> <span className="text-white/40 text-xl">({cart.reduce((a, i) => a + i.qty, 0)} items)</span></h1>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-8 items-start">
          {/* items */}
          <div className="space-y-4">
            {cart.map((i) => (
              <div key={i.slug + (i.variant ?? "")} className="flex gap-4 bg-[#141414] border border-white/8 rounded-3xl p-4 sm:p-5">
                <Link href={`/product/${i.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.image} alt={i.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${i.slug}`} className="font-display font-bold text-[15px] sm:text-lg hover:text-[#F5C542] leading-snug block">{i.name}</Link>
                  {i.variant && <p className="text-[13px] text-[#F5C542]/90 mt-1">{i.variant}</p>}
                  <p className="font-black gold-text text-lg mt-1.5">{formatPrice(i.price)} <span className="text-white/40 text-[13px] font-normal">each</span></p>
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                    <div className="flex items-center gap-3 bg-black border border-white/12 rounded-full px-1.5 py-1.5">
                      <button onClick={() => updateQty(i.slug, i.variant, i.qty - 1)} className="w-8 h-8 grid place-items-center rounded-full hover:bg-white/10" aria-label="Decrease"><Minus size={15} /></button>
                      <span className="font-black w-6 text-center tabular-nums">{i.qty}</span>
                      <button onClick={() => updateQty(i.slug, i.variant, i.qty + 1)} className="w-8 h-8 grid place-items-center rounded-full hover:bg-white/10" aria-label="Increase"><Plus size={15} /></button>
                    </div>
                    <p className="font-display font-black text-lg">{formatPrice(i.price * i.qty)}</p>
                    <button onClick={() => removeFromCart(i.slug, i.variant)} className="flex items-center gap-1.5 text-[13px] text-white/45 hover:text-red-400 font-semibold"><Trash2 size={15} /> Remove</button>
                  </div>
                </div>
              </div>
            ))}
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-[#F5C542] hover:underline mt-2">← Continue shopping</Link>
          </div>

          {/* summary */}
          <aside className="bg-[#141414] border border-[#D4A017]/25 rounded-3xl p-6 lg:sticky lg:top-28">
            <h2 className="font-display font-black text-xl">Order Summary</h2>
            {/* promo */}
            <div className="mt-5">
              <label className="text-[13px] font-bold text-white/70 flex items-center gap-1.5"><Tag size={14} className="text-[#F5C542]" /> Promo code</label>
              <div className="flex gap-2 mt-2">
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Try B7STAR10" className="flex-1 bg-black border border-white/12 rounded-xl px-4 py-3 text-sm focus:border-[#F5C542]/60 focus:outline-none uppercase placeholder:normal-case" aria-label="Promo code" />
                <button onClick={apply} className="gold-btn rounded-xl px-5 text-sm">Apply</button>
              </div>
              {error && <p className="text-red-400 text-[13px] mt-2">{error}</p>}
              {promo && <p className="text-green-400 text-[13px] mt-2 font-bold">✓ {promo} active — {PROMOS[promo] * 100}% off applied</p>}
              <p className="text-[12px] text-white/40 mt-2">New here? <span className="text-[#F5C542] font-bold">B7STAR10</span> = 10% off your first order.</p>
            </div>
            <dl className="mt-5 space-y-2.5 text-sm border-t border-white/8 pt-5">
              <div className="flex justify-between"><dt className="text-white/60">Subtotal</dt><dd className="font-bold">{formatPrice(subtotal)}</dd></div>
              {discount > 0 && <div className="flex justify-between text-green-400"><dt>Discount ({promo})</dt><dd className="font-bold">−{formatPrice(discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-white/60">Shipping</dt><dd className="font-bold">{shipping === 0 ? <span className="text-green-400">FREE</span> : formatPrice(shipping)}</dd></div>
              <div className="flex justify-between font-display font-black text-xl border-t border-white/8 pt-4"><dt>Total</dt><dd className="gold-text">{formatPrice(total)}</dd></div>
            </dl>
            <Link href="/checkout" className="gold-btn w-full rounded-2xl py-4 text-[15px] flex items-center justify-center gap-2 mt-5">Proceed to Checkout <ArrowRight size={17} /></Link>
            <p className="flex items-center justify-center gap-1.5 text-[12px] text-white/45 mt-3"><Lock size={12} className="text-green-400" /> 256-bit SSL secure checkout</p>
            <div className="flex items-center justify-center gap-4 mt-4 text-[12px] text-white/50">
              <span className="flex items-center gap-1"><Truck size={13} className="text-[#F5C542]" /> Fast dispatch</span>
              <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-[#F5C542]" /> Buyer protection</span>
            </div>
          </aside>
        </div>

        {/* upsell */}
        <div className="mt-14">
          <h2 className="font-display font-black text-2xl">Frequently added <span className="gold-text">together</span></h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-6">
            {suggestions.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
