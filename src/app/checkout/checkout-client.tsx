"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, RotateCcw, CreditCard, Wallet, Banknote, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { useStore } from "@/store/StoreContext";
import { formatPrice } from "@/data/products";
import { cn } from "@/lib/utils";

const PROMOS: Record<string, number> = { B7STAR10: 0.1, STAR15: 0.15, WELCOME5: 0.05 };

export default function CheckoutClient() {
  const { cart, subtotal, promo, clearCart, showToast } = useStore();
  const router = useRouter();
  const [pay, setPay] = useState("card");
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({ email: "", first: "", last: "", address: "", city: "", postcode: "", country: "United States", phone: "", card: "", exp: "", cvc: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const discount = promo && PROMOS[promo] ? subtotal * PROMOS[promo] : 0;
  const shipping = subtotal === 0 ? 0 : subtotal - discount >= 75 ? 0 : 4.95;
  const total = Math.max(0, subtotal - discount + shipping);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email required";
    if (!form.first.trim()) e.first = "Required";
    if (!form.last.trim()) e.last = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.postcode.trim()) e.postcode = "Required";
    if (pay === "card") {
      if (form.card.replace(/\s/g, "").length < 12) e.card = "Enter card number";
      if (!form.exp.trim()) e.exp = "MM/YY";
      if (form.cvc.length < 3) e.cvc = "CVC";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    if (!validate()) { showToast("Please fix the highlighted fields"); return; }
    setPlacing(true);
    try {
      // POST to /api/orders — swap body for Stripe PaymentIntent confirmation in production
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email, firstName: form.first, lastName: form.last,
          address: form.address, city: form.city, postcode: form.postcode,
          country: form.country, phone: form.phone, paymentMethod: pay,
          promoCode: promo, items: cart.map((i) => ({ slug: i.slug, name: i.name, variant: i.variant, qty: i.qty, price: i.price })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");
      clearCart();
      // stash receipt for success page
      localStorage.setItem("b7_last_order", JSON.stringify({ number: data.orderNumber, total: data.total, email: form.email }));
      router.push("/checkout/success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Checkout failed. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  const inputCls = (k: string) => cn("w-full bg-black border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all placeholder:text-white/30", errors[k] ? "border-red-500" : "border-white/12 focus:border-[#F5C542]/60");

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <CheckCircle2 size={48} className="mx-auto text-white/20" />
        <h1 className="font-display font-black text-3xl mt-5">Nothing to check out yet</h1>
        <p className="text-white/55 mt-2">Your cart is empty — add some star power first.</p>
        <Link href="/shop" className="gold-btn rounded-full px-8 py-3.5 text-sm inline-block mt-6">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0B0B] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <p className="text-[13px] text-white/45 flex items-center gap-1.5"><Link href="/cart" className="hover:text-[#F5C542]">Cart</Link><ChevronRight size={13} /><span className="text-white">Checkout</span></p>
        <h1 className="font-display font-black text-3xl sm:text-4xl mt-2">Secure <span className="gold-text">Checkout</span></h1>
        <p className="flex items-center gap-1.5 text-[13px] text-white/50 mt-2"><Lock size={13} className="text-green-400" /> Guest checkout — no account needed. Encrypted & protected.</p>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-8 items-start">
          <div className="space-y-6">
            {/* contact + shipping */}
            <section className="bg-[#141414] border border-white/8 rounded-3xl p-6 sm:p-8">
              <h2 className="font-display font-bold text-lg flex items-center gap-2.5"><span className="w-7 h-7 rounded-full gold-bg text-black text-[13px] grid place-items-center font-black">1</span> Contact & Shipping</h2>
              <div className="grid sm:grid-cols-2 gap-3.5 mt-5">
                <div className="sm:col-span-2">
                  <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Email address *" className={inputCls("email")} type="email" autoComplete="email" />
                  {errors.email && <p className="text-red-400 text-[12px] mt-1">{errors.email}</p>}
                </div>
                <div><input value={form.first} onChange={(e) => set("first", e.target.value)} placeholder="First name *" className={inputCls("first")} autoComplete="given-name" />{errors.first && <p className="text-red-400 text-[12px] mt-1">{errors.first}</p>}</div>
                <div><input value={form.last} onChange={(e) => set("last", e.target.value)} placeholder="Last name *" className={inputCls("last")} autoComplete="family-name" />{errors.last && <p className="text-red-400 text-[12px] mt-1">{errors.last}</p>}</div>
                <div className="sm:col-span-2"><input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street address *" className={inputCls("address")} autoComplete="street-address" />{errors.address && <p className="text-red-400 text-[12px] mt-1">{errors.address}</p>}</div>
                <div><input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="City *" className={inputCls("city")} autoComplete="address-level2" />{errors.city && <p className="text-red-400 text-[12px] mt-1">{errors.city}</p>}</div>
                <div><input value={form.postcode} onChange={(e) => set("postcode", e.target.value)} placeholder="ZIP / Postcode *" className={inputCls("postcode")} autoComplete="postal-code" />{errors.postcode && <p className="text-red-400 text-[12px] mt-1">{errors.postcode}</p>}</div>
                <div>
                  <select value={form.country} onChange={(e) => set("country", e.target.value)} className={inputCls("country")} aria-label="Country">
                    {["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "UAE", "India", "Pakistan", "South Africa"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Phone (for delivery SMS)" className={inputCls("phone")} type="tel" autoComplete="tel" /></div>
              </div>
            </section>

            {/* payment */}
            <section className="bg-[#141414] border border-white/8 rounded-3xl p-6 sm:p-8">
              <h2 className="font-display font-bold text-lg flex items-center gap-2.5"><span className="w-7 h-7 rounded-full gold-bg text-black text-[13px] grid place-items-center font-black">2</span> Payment Method</h2>
              <div className="grid sm:grid-cols-3 gap-3 mt-5">
                {[
                  { id: "card", icon: CreditCard, t: "Card", s: "Visa • MC • Amex" },
                  { id: "paypal", icon: Wallet, t: "PayPal", s: "Buyer protection" },
                  { id: "cod", icon: Banknote, t: "Cash on Delivery", s: "Select zones" },
                ].map((m) => (
                  <button key={m.id} onClick={() => setPay(m.id)} className={cn("rounded-2xl border p-4 text-left transition-all", pay === m.id ? "border-[#F5C542] bg-[#F5C542]/10 shadow-[0_0_20px_rgba(245,197,66,.15)]" : "border-white/12 hover:border-white/30")}>
                    <m.icon size={20} className={pay === m.id ? "text-[#F5C542]" : "text-white/60"} />
                    <p className="font-bold text-sm mt-2">{m.t}</p>
                    <p className="text-[12px] text-white/50">{m.s}</p>
                  </button>
                ))}
              </div>
              {pay === "card" && (
                <div className="grid sm:grid-cols-[1fr_140px_110px] gap-3.5 mt-5">
                  <div className="sm:col-span-3"><input value={form.card} onChange={(e) => set("card", e.target.value.replace(/[^\d\s]/g, "").slice(0, 19))} placeholder="Card number  •••• •••• •••• ••••" inputMode="numeric" className={inputCls("card")} />{errors.card && <p className="text-red-400 text-[12px] mt-1">{errors.card}</p>}</div>
                  <div><input value={form.exp} onChange={(e) => set("exp", e.target.value.slice(0, 5))} placeholder="MM/YY" className={inputCls("exp")} />{errors.exp && <p className="text-red-400 text-[12px] mt-1">{errors.exp}</p>}</div>
                  <div><input value={form.cvc} onChange={(e) => set("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="CVC" inputMode="numeric" className={inputCls("cvc")} />{errors.cvc && <p className="text-red-400 text-[12px] mt-1">{errors.cvc}</p>}</div>
                </div>
              )}
              {pay === "paypal" && <p className="text-[13px] text-white/55 bg-black/40 border border-white/10 rounded-xl p-4 mt-5">You&apos;ll be redirected to PayPal to approve {formatPrice(total)} securely. (Demo: order is recorded instantly — connect PayPal/Stripe keys in <code className="text-[#F5C542]">/api/orders</code>.)</p>}
              {pay === "cod" && <p className="text-[13px] text-white/55 bg-black/40 border border-white/10 rounded-xl p-4 mt-5">Pay in cash when your order arrives. Please keep the exact amount ready — our courier will SMS before delivery.</p>}
              {/* To integrate Stripe: create a PaymentIntent in /api/orders (or /api/stripe/intent), confirm with stripe.js Elements here. */}
            </section>

            <button onClick={placeOrder} disabled={placing} className="gold-btn w-full rounded-2xl py-4.5 text-[16px] py-4 flex items-center justify-center gap-2 disabled:opacity-60">
              {placing ? <><Loader2 size={19} className="animate-spin" /> Placing your order…</> : <><Lock size={17} /> Pay {formatPrice(total)} Securely</>}
            </button>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] text-white/50">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#F5C542]" /> Money-back guarantee</span>
              <span className="flex items-center gap-1.5"><Lock size={14} className="text-green-400" /> 256-bit SSL</span>
              <span className="flex items-center gap-1.5"><RotateCcw size={14} className="text-[#F5C542]" /> 30-day returns</span>
            </div>
          </div>

          {/* summary */}
          <aside className="bg-[#141414] border border-[#D4A017]/25 rounded-3xl p-6 lg:sticky lg:top-28">
            <h2 className="font-display font-black text-lg">Order Summary</h2>
            <div className="space-y-3 mt-4 max-h-[320px] overflow-y-auto pr-1">
              {cart.map((i) => (
                <div key={i.slug + (i.variant ?? "")} className="flex gap-3 items-center">
                  <div className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={i.image} alt={i.name} className="w-14 h-14 rounded-xl object-cover" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 grid place-items-center rounded-full gold-bg text-black text-[11px] font-black">{i.qty}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold truncate">{i.name}</p>
                    {i.variant && <p className="text-[11px] text-white/45 truncate">{i.variant}</p>}
                  </div>
                  <p className="text-[13px] font-bold">{formatPrice(i.price * i.qty)}</p>
                </div>
              ))}
            </div>
            <dl className="mt-5 space-y-2.5 text-sm border-t border-white/8 pt-5">
              <div className="flex justify-between"><dt className="text-white/60">Subtotal</dt><dd className="font-bold">{formatPrice(subtotal)}</dd></div>
              {discount > 0 && <div className="flex justify-between text-green-400"><dt>Discount ({promo})</dt><dd>−{formatPrice(discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-white/60">Shipping</dt><dd className="font-bold">{shipping === 0 ? <span className="text-green-400">FREE</span> : formatPrice(shipping)}</dd></div>
              <div className="flex justify-between font-display font-black text-xl border-t border-white/8 pt-4"><dt>Total</dt><dd className="gold-text">{formatPrice(total)}</dd></div>
            </dl>
            <div className="flex flex-wrap gap-1.5 mt-5 justify-center">
              {["VISA", "MC", "AMEX", "PayPal", "Apple Pay"].map((p) => <span key={p} className="text-[10px] font-black bg-black border border-white/12 rounded-md px-2 py-1 text-white/60">{p}</span>)}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
