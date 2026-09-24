"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Truck, ArrowRight, Package } from "lucide-react";

export default function SuccessPage() {
  const [order, setOrder] = useState<{ number: string; total: string; email: string } | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("b7_last_order");
      if (raw) setOrder(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-24 h-24 mx-auto rounded-full gold-bg grid place-items-center shadow-[0_0_50px_rgba(245,197,66,.5)] animate-floaty">
        <CheckCircle2 size={48} className="text-black" />
      </div>
      <p className="text-[11px] font-black tracking-[0.3em] text-[#F5C542] mt-8">★ ORDER CONFIRMED</p>
      <h1 className="font-display font-black text-3xl sm:text-5xl mt-3">Thank you, <span className="gold-text">Star!</span></h1>
      <p className="text-white/60 mt-3">Your order is being prepared with premium packaging. Tracking details are on the way{order?.email ? <> to <span className="text-white font-bold">{order.email}</span></> : ""}.</p>

      {order && (
        <div className="bg-[#141414] border border-[#D4A017]/30 rounded-3xl p-6 mt-8 flex items-center justify-between text-left">
          <div>
            <p className="text-[12px] text-white/50 font-bold tracking-widest">ORDER NUMBER</p>
            <p className="font-display font-black text-xl gold-text">{order.number}</p>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-white/50 font-bold tracking-widest">CHARGED</p>
            <p className="font-display font-black text-xl">{order.total}</p>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3 mt-6 text-left">
        <div className="bg-[#141414] border border-white/8 rounded-2xl p-5 flex gap-3">
          <Truck size={22} className="text-[#F5C542] shrink-0" />
          <div><p className="font-bold text-sm">Fast dispatch</p><p className="text-[13px] text-white/55 mt-1">Ships within 24h. Live tracking by SMS + email.</p></div>
        </div>
        <div className="bg-[#141414] border border-white/8 rounded-2xl p-5 flex gap-3">
          <Package size={22} className="text-[#F5C542] shrink-0" />
          <div><p className="font-bold text-sm">Track anytime</p><p className="text-[13px] text-white/55 mt-1">View status in Account → Orders with your email.</p></div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Link href="/shop" className="gold-btn rounded-full px-8 py-3.5 text-sm inline-flex items-center gap-2">Keep Shopping <ArrowRight size={16} /></Link>
        <Link href="/account" className="ghost-btn rounded-full px-8 py-3.5 text-sm font-bold text-white">View My Orders</Link>
      </div>
    </div>
  );
}
