"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, MessageCircle } from "lucide-react";
import { FAQS } from "@/data/products";
import { cn } from "@/lib/utils";

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="text-[11px] font-black tracking-[0.3em] text-[#F5C542] text-center">★ HELP CENTER</p>
      <h1 className="font-display font-black text-4xl sm:text-5xl mt-2 text-center">Questions? <span className="gold-text">Answered.</span></h1>
      <div className="space-y-3 mt-9">
        {FAQS.map((f, i) => (
          <div key={i} className={cn("bg-[#141414] border rounded-2xl overflow-hidden transition-all", open === i ? "border-[#F5C542]/50" : "border-white/8")}>
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center gap-4 p-5 text-left" aria-expanded={open === i}>
              <span className="font-display font-bold text-[15px] flex-1">{f.q}</span>
              <span className={cn("w-8 h-8 grid place-items-center rounded-full border transition-all shrink-0", open === i ? "gold-bg text-black border-transparent rotate-45" : "border-white/15 text-white/60")}><Plus size={16} /></span>
            </button>
            {open === i && <p className="px-5 pb-5 text-[14px] text-white/65 leading-relaxed animate-fadeIn">{f.a}</p>}
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-[#1c1503] to-[#101010] border border-[#D4A017]/25 rounded-3xl p-7 mt-8 text-center">
        <MessageCircle size={26} className="mx-auto text-[#F5C542]" />
        <h2 className="font-display font-bold text-xl mt-3">Still stuck?</h2>
        <p className="text-white/55 text-sm mt-1">Our support crew replies in ~4 hours, 7 days a week.</p>
        <Link href="/contact" className="gold-btn rounded-full px-7 py-3 text-sm inline-block mt-4">Contact Support</Link>
      </div>
    </div>
  );
}
