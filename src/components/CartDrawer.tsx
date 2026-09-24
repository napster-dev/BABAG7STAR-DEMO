"use client";

import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Lock } from "lucide-react";
import { useStore } from "@/store/StoreContext";
import { formatPrice } from "@/data/products";

const FREE_SHIP_AT = 75;

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, subtotal } = useStore();
  if (!cartOpen) return null;
  const progress = Math.min(100, (subtotal / FREE_SHIP_AT) * 100);
  const remaining = Math.max(0, FREE_SHIP_AT - subtotal);

  return (
    <div className="fixed inset-0 z-[75]" role="dialog" aria-label="Shopping cart">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setCartOpen(false)} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-[#111111] border-l border-[#D4A017]/25 flex flex-col animate-fadeUp shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="font-display font-black text-lg flex items-center gap-2"><ShoppingBag size={19} className="text-[#F5C542]" /> Your Cart <span className="text-sm text-white/50 font-body font-normal">({cart.reduce((a, i) => a + i.qty, 0)})</span></h3>
          <button onClick={() => setCartOpen(false)} className="p-2 rounded-full hover:bg-white/10" aria-label="Close cart"><X size={19} /></button>
        </div>

        <div className="px-5 py-4 border-b border-white/8 bg-[#0d0d0d]">
          {remaining > 0 ? (
            <p className="text-[13px] text-white/70">Add <span className="text-[#F5C542] font-bold">{formatPrice(remaining)}</span> more for <span className="font-bold">FREE express shipping</span></p>
          ) : (
            <p className="text-[13px] text-green-400 font-bold">🎉 You unlocked FREE express shipping!</p>
          )}
          <div className="h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div className="h-full gold-bg rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#1A1A1A] grid place-items-center border border-white/10"><ShoppingBag size={30} className="text-white/30" /></div>
              <p className="font-display font-bold text-lg mt-5">Your cart is empty</p>
              <p className="text-white/50 text-sm mt-1">Discover trending gadgets loved by 40,000+ shoppers.</p>
              <button onClick={() => setCartOpen(false)} className="gold-btn rounded-xl px-6 py-3 text-sm mt-5">Start Shopping</button>
            </div>
          ) : (
            cart.map((i) => (
              <div key={i.slug + (i.variant ?? "")} className="flex gap-3 bg-[#1A1A1A] border border-white/8 rounded-2xl p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.image} alt={i.name} className="w-[72px] h-[72px] rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] leading-snug truncate">{i.name}</p>
                  {i.variant && <p className="text-[12px] text-[#F5C542]/90 mt-0.5">{i.variant}</p>}
                  <p className="text-[13px] font-bold gold-text mt-1">{formatPrice(i.price)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-black rounded-full px-1 py-1 border border-white/10">
                      <button onClick={() => updateQty(i.slug, i.variant, i.qty - 1)} className="w-6 h-6 grid place-items-center rounded-full hover:bg-white/10" aria-label="Decrease"><Minus size={13} /></button>
                      <span className="text-[13px] font-bold w-5 text-center">{i.qty}</span>
                      <button onClick={() => updateQty(i.slug, i.variant, i.qty + 1)} className="w-6 h-6 grid place-items-center rounded-full hover:bg-white/10" aria-label="Increase"><Plus size={13} /></button>
                    </div>
                    <button onClick={() => removeFromCart(i.slug, i.variant)} className="p-1.5 text-white/40 hover:text-red-400" aria-label="Remove item"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-[#0d0d0d] space-y-3">
            <div className="flex justify-between text-sm"><span className="text-white/60">Subtotal</span><span className="font-display font-black text-lg gold-text">{formatPrice(subtotal)}</span></div>
            <p className="text-[12px] text-white/45">Shipping & taxes calculated at checkout.</p>
            <Link href="/cart" onClick={() => setCartOpen(false)} className="gold-btn rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 w-full">View Cart <ArrowRight size={16} /></Link>
            <Link href="/checkout" onClick={() => setCartOpen(false)} className="ghost-btn rounded-xl py-3.5 text-sm font-bold flex items-center justify-center gap-2 w-full text-white"><Lock size={14} className="text-[#F5C542]" /> Secure Checkout</Link>
          </div>
        )}
      </aside>
    </div>
  );
}
