"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Loader2, Star } from "lucide-react";
import Logo from "@/components/Logo";
import { useStore } from "@/store/StoreContext";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useStore();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email) || pass.length < 4) {
      showToast("Enter a valid email and 4+ character password");
      return;
    }
    setLoading(true);
    // Demo auth — persist to localStorage. Replace with NextAuth / Supabase / Clerk in production.
    setTimeout(() => {
      localStorage.setItem("b7_user", JSON.stringify({ name: mode === "register" ? name || email.split("@")[0] : email.split("@")[0], email }));
      showToast(mode === "login" ? "Welcome back, Star! ★" : "Account created — welcome to the Star Club!");
      router.push("/account");
    }, 800);
  };

  return (
    <div className="min-h-[80vh] grid lg:grid-cols-2">
      {/* brand panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-black flex-col justify-between p-12 border-r border-[#D4A017]/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.pexels.com/photos/236086/pexels-photo-236086.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/85 to-black" />
        <div className="relative"><Logo /></div>
        <div className="relative">
          <p className="flex items-center gap-1 text-[#F5C542]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className="fill-[#F5C542]" />)} <span className="text-white/60 text-sm ml-1">4.8 from 12,000+ reviews</span></p>
          <h2 className="font-display font-black text-4xl leading-tight mt-4">One account.<br /><span className="gold-text">Every perk.</span></h2>
          <ul className="mt-6 space-y-3 text-[15px] text-white/70">
            {["Faster checkout with saved addresses", "Live order tracking & history", "Members-only prices & early drops", "Wishlist synced across devices*"].map((t) => (
              <li key={t} className="flex gap-2.5"><span className="text-[#F5C542]">★</span> {t}</li>
            ))}
          </ul>
        </div>
        <p className="relative text-[12px] text-white/40">* Demo build — account data stays in your browser until a real backend is connected.</p>
      </div>

      {/* form */}
      <div className="flex items-center justify-center px-4 sm:px-8 py-14">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-6"><Logo /></div>
          <div className="bg-[#141414] border border-white/10 rounded-3xl p-7 sm:p-9">
            <div className="grid grid-cols-2 bg-black rounded-full p-1 border border-white/10">
              {(["login", "register"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={`rounded-full py-2.5 text-sm font-bold capitalize transition-all ${mode === m ? "gold-bg text-black" : "text-white/60"}`}>{m === "login" ? "Login" : "Register"}</button>
              ))}
            </div>
            <h1 className="font-display font-black text-2xl mt-6">{mode === "login" ? "Welcome back, Star ★" : "Join the Star Club"}</h1>
            <p className="text-white/55 text-sm mt-1">{mode === "login" ? "Log in for faster checkout & tracking." : "Create an account — get 10% off your first order."}</p>
            <form onSubmit={submit} className="space-y-3.5 mt-6">
              {mode === "register" && (
                <div className="flex items-center bg-black border border-white/12 rounded-xl px-4 focus-within:border-[#F5C542]/60">
                  <User size={16} className="text-white/40" />
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="bg-transparent flex-1 px-3 py-3.5 text-sm focus:outline-none" autoComplete="name" />
                </div>
              )}
              <div className="flex items-center bg-black border border-white/12 rounded-xl px-4 focus-within:border-[#F5C542]/60">
                <Mail size={16} className="text-white/40" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" className="bg-transparent flex-1 px-3 py-3.5 text-sm focus:outline-none" autoComplete="email" />
              </div>
              <div className="flex items-center bg-black border border-white/12 rounded-xl px-4 focus-within:border-[#F5C542]/60">
                <Lock size={16} className="text-white/40" />
                <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password" type="password" className="bg-transparent flex-1 px-3 py-3.5 text-sm focus:outline-none" autoComplete={mode === "login" ? "current-password" : "new-password"} />
              </div>
              <button disabled={loading} className="gold-btn w-full rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Please wait…</> : mode === "login" ? "Login Securely" : "Create Account"}
              </button>
            </form>
            <p className="text-[12px] text-white/45 text-center mt-4">Protected by encryption. By continuing you agree to our <Link href="/terms" className="text-[#F5C542] hover:underline">Terms</Link> & <Link href="/privacy" className="text-[#F5C542] hover:underline">Privacy Policy</Link>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
