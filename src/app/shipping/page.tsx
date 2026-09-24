import { Truck, RotateCcw, ShieldCheck, Package } from "lucide-react";

export const metadata = { title: "Shipping & Returns | BabaG7Star" };

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="text-[11px] font-black tracking-[0.3em] text-[#F5C542]">★ FAST • FREE • FLEXIBLE</p>
      <h1 className="font-display font-black text-4xl sm:text-5xl mt-2">Shipping & <span className="gold-text">Returns</span></h1>

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        {[
          { icon: Truck, t: "Standard 2–4 days", d: "Free on orders $75+. Otherwise $4.95 flat. Tracked & insured, dispatched same-day before 2pm." },
          { icon: Package, t: "Express 1–2 days", d: "$9.95 flat, free over $150. Priority picking + courier upgrade at checkout." },
          { icon: RotateCcw, t: "30-day returns", d: "Unused items in original packaging = full refund. Faulty items get free return labels + instant replacement or refund." },
          { icon: ShieldCheck, t: "Warranty", d: "12-month BabaG7Star warranty on everything. 7-day DOA promise: dead on arrival = new unit shipped immediately." },
        ].map((c) => (
          <div key={c.t} className="bg-[#141414] border border-white/8 rounded-3xl p-6">
            <c.icon size={22} className="text-[#F5C542]" />
            <h2 className="font-display font-bold text-lg mt-3">{c.t}</h2>
            <p className="text-white/60 text-sm mt-2 leading-relaxed">{c.d}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#141414] border border-white/8 rounded-3xl p-7 mt-6 prose-sm">
        <h2 className="font-display font-bold text-xl">How returns work</h2>
        <ol className="list-decimal ml-5 mt-3 space-y-2 text-white/65 text-sm leading-relaxed">
          <li>Email <span className="text-[#F5C542]">support@babag7star.com</span> with your order number + reason (or use the Contact page).</li>
          <li>We send a prepaid label within 24h (free for faults, $4.95 deducted for change-of-mind).</li>
          <li>Drop at any courier point. Refund lands within 48h of warehouse scan.</li>
          <li>Exchanges ship the moment your return is scanned — no waiting.</li>
        </ol>
        <h2 className="font-display font-bold text-xl mt-7">Non-returnable</h2>
        <p className="text-white/65 text-sm mt-2">Opened ear tips / hygiene-sealed items for health reasons (unless faulty), gift cards, and items damaged by misuse. Everything else is fair game.</p>
      </div>
    </div>
  );
}
