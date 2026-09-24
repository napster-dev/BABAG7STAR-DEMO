"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2 } from "lucide-react";
import { useStore } from "@/store/StoreContext";

export default function ContactPage() {
  const { showToast } = useStore();
  const [form, setForm] = useState({ name: "", email: "", subject: "Order support", message: "" });
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || !form.message.trim()) {
      showToast("Please complete name, valid email and message");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Failed to send");
      setState("done");
      setForm({ name: "", email: "", subject: "Order support", message: "" });
    } catch {
      showToast("Could not send — try support@babag7star.com");
      setState("idle");
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-12">
      <p className="text-[11px] font-black tracking-[0.3em] text-[#F5C542]">★ WE REPLY IN ~4 HOURS</p>
      <h1 className="font-display font-black text-4xl sm:text-5xl mt-2">Let&apos;s <span className="gold-text">talk</span></h1>
      <p className="text-white/55 mt-2">Order help, product advice, returns — real humans, 7 days a week.</p>

      <div className="grid lg:grid-cols-[340px_1fr] gap-6 mt-8 items-start">
        <div className="space-y-3.5">
          {[
            { icon: Mail, t: "Email us", d: "support@babag7star.com", s: "Replies within 4 hours" },
            { icon: Phone, t: "Call us", d: "+1 (800) 7STAR-07", s: "Mon–Sat, 9am–8pm EST" },
            { icon: MapPin, t: "Visit", d: "7 Star Avenue, Tech District, NY", s: "Flagship pickup point" },
            { icon: Clock, t: "Support hours", d: "7 days a week", s: "Avg. response: 3h 42m" },
          ].map((c) => (
            <div key={c.t} className="bg-[#141414] border border-white/8 rounded-2xl p-5 flex gap-4">
              <span className="w-11 h-11 rounded-xl gold-bg grid place-items-center text-black shrink-0"><c.icon size={19} /></span>
              <div><p className="font-bold text-sm">{c.t}</p><p className="text-sm text-[#F5C542] font-semibold mt-0.5">{c.d}</p><p className="text-[12px] text-white/45">{c.s}</p></div>
            </div>
          ))}
          <div className="rounded-2xl overflow-hidden border border-white/10 h-52 bg-[#1A1A1A] relative">
            <iframe
              title="BabaG7Star store map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-74.0100%2C40.7050%2C-73.9900%2C40.7200&layer=mapnik&marker=40.7128%2C-74.0000"
              className="w-full h-full grayscale invert-[0.9] contrast-[0.9]"
              loading="lazy"
            />
          </div>
        </div>

        <div className="bg-[#141414] border border-white/8 rounded-3xl p-6 sm:p-9">
          {state === "done" ? (
            <div className="text-center py-14">
              <CheckCircle2 size={52} className="mx-auto text-green-400" />
              <h2 className="font-display font-black text-2xl mt-4">Message received ★</h2>
              <p className="text-white/55 mt-2">Our crew will reply within ~4 hours. Check spam just in case.</p>
              <button onClick={() => setState("idle")} className="ghost-btn rounded-full px-7 py-3 text-sm font-bold mt-6 text-white">Send another</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-[13px] font-bold">Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="mt-1.5 w-full bg-black border border-white/12 rounded-xl px-4 py-3 text-sm focus:border-[#F5C542]/60 focus:outline-none" /></div>
                <div><label className="text-[13px] font-bold">Email *</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" type="email" className="mt-1.5 w-full bg-black border border-white/12 rounded-xl px-4 py-3 text-sm focus:border-[#F5C542]/60 focus:outline-none" /></div>
              </div>
              <div><label className="text-[13px] font-bold">Subject</label>
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-1.5 w-full bg-black border border-white/12 rounded-xl px-4 py-3 text-sm focus:border-[#F5C542]/60 focus:outline-none">
                  {["Order support", "Product question", "Returns & warranty", "Wholesale", "Something else"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className="text-[13px] font-bold">Message *</label><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={6} placeholder="How can we help? Include your order number if relevant…" className="mt-1.5 w-full bg-black border border-white/12 rounded-xl px-4 py-3 text-sm focus:border-[#F5C542]/60 focus:outline-none resize-none" /></div>
              <button disabled={state === "loading"} className="gold-btn w-full rounded-xl py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                {state === "loading" ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : <><Send size={15} /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
