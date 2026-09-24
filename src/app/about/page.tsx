import Link from "next/link";
import { Zap, ShieldCheck, Truck, Heart, ArrowRight, Star } from "lucide-react";

export const metadata = { title: "About Us | BabaG7Star", description: "The BabaG7Star story — premium tech, honest prices, star-speed delivery." };

const VALUES = [
  { icon: Zap, t: "Speed is a feature", d: "Same-day dispatch, live tracking, express options. We move like the gold swoosh in our logo — fast and forward." },
  { icon: ShieldCheck, t: "Trust is earned", d: "100% genuine stock, pre-dispatch testing, 12-month warranty and real human support 7 days a week." },
  { icon: Heart, t: "Premium for everyone", d: "Flagship-grade quality without flagship markups. Fair prices, transparent discounts, no fake RRPs." },
];

export default function AboutPage() {
  return (
    <div className="bg-[#0B0B0B]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 hero-grid" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
          <p className="text-[11px] font-black tracking-[0.3em] text-[#F5C542]">★ OUR STORY</p>
          <h1 className="font-display font-black text-4xl sm:text-6xl leading-tight mt-3">Born for the fast.<br /><span className="gold-text">Built on trust.</span></h1>
          <p className="text-white/60 text-lg mt-5 max-w-2xl mx-auto leading-relaxed">BabaG7Star started with one belief: buying great tech online should feel like unboxing luxury — exciting, effortless and safe. Today we serve 40,000+ customers with curated electronics, smart gadgets and lifestyle essentials.</p>
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {[["40K+", "Happy customers"], ["4.8★", "Average rating"], ["16+", "Curated categories"], ["24H", "Dispatch time"]].map(([v, l]) => (
              <div key={l}><p className="font-display font-black text-3xl gold-text">{v}</p><p className="text-[13px] text-white/50">{l}</p></div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pb-16 grid md:grid-cols-2 gap-6 items-stretch">
        <div className="rounded-3xl overflow-hidden border border-white/10 min-h-[320px] relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.pexels.com/photos/15110141/pexels-photo-15110141.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" alt="BabaG7Star curated tech workspace" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <p className="absolute bottom-5 left-5 right-5 text-sm text-white/80 bg-black/60 backdrop-blur rounded-2xl p-4 border border-white/10">Every product is hand-picked, tested and photographed by our in-house curation team.</p>
        </div>
        <div className="bg-[#141414] border border-white/8 rounded-3xl p-8">
          <h2 className="font-display font-black text-2xl">The <span className="gold-text">B7</span> promise</h2>
          <ul className="mt-5 space-y-4 text-[15px] text-white/70 leading-relaxed">
            <li className="flex gap-3"><Star size={17} className="text-[#F5C542] shrink-0 mt-0.5" /> <span><strong className="text-white">Genuine, always.</strong> Authorized sourcing, sealed boxes, serial-verified electronics.</span></li>
            <li className="flex gap-3"><Star size={17} className="text-[#F5C542] shrink-0 mt-0.5" /> <span><strong className="text-white">Tested before it ships.</strong> Every unit passes a 12-point quality check.</span></li>
            <li className="flex gap-3"><Star size={17} className="text-[#F5C542] shrink-0 mt-0.5" /> <span><strong className="text-white">Humans on support.</strong> Real replies in under 4 hours, 7 days a week.</span></li>
            <li className="flex gap-3"><Star size={17} className="text-[#F5C542] shrink-0 mt-0.5" /> <span><strong className="text-white">No-risk shopping.</strong> 30-day returns + 12-month warranty standard.</span></li>
          </ul>
          <Link href="/shop" className="gold-btn rounded-full px-7 py-3 text-sm inline-flex items-center gap-2 mt-7">Shop the collection <ArrowRight size={15} /></Link>
        </div>
      </div>

      <div className="bg-[#0e0e0e] border-y border-white/8">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-14 grid sm:grid-cols-3 gap-5">
          {VALUES.map((v) => (
            <div key={v.t} className="bg-[#141414] border border-white/8 rounded-3xl p-7">
              <div className="w-12 h-12 rounded-2xl gold-bg grid place-items-center text-black"><v.icon size={22} /></div>
              <h3 className="font-display font-bold text-lg mt-4">{v.t}</h3>
              <p className="text-white/55 text-sm mt-2 leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-14 grid sm:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-white/10 p-8 bg-[#141414]">
          <Truck size={26} className="text-[#F5C542]" />
          <h3 className="font-display font-bold text-xl mt-3">Our mission</h3>
          <p className="text-white/60 text-sm mt-2 leading-relaxed">Make premium tech accessible — delivering flagship-grade gadgets with honest pricing, blazing logistics and after-sales care that treats every order like our first.</p>
        </div>
        <div className="rounded-3xl gold-bg p-8 text-black">
          <ShieldCheck size={26} />
          <h3 className="font-display font-black text-xl mt-3">Shop with zero risk</h3>
          <p className="text-black/70 text-sm mt-2 leading-relaxed">12-month warranty • 7-day DOA replacement • 30-day returns • secure encrypted payments. If we wouldn&apos;t gift it, we don&apos;t sell it.</p>
          <Link href="/contact" className="inline-block bg-black text-[#F5C542] font-bold text-sm rounded-full px-6 py-2.5 mt-4">Talk to us →</Link>
        </div>
      </div>
    </div>
  );
}
