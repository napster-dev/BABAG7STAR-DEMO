"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Heart, MapPin, LogOut, Plus, Trash2, User as UserIcon, ShoppingBag } from "lucide-react";
import { useStore } from "@/store/StoreContext";
import { PRODUCTS, formatPrice } from "@/data/products";

type Order = { id: number; orderNumber: string; total: string; status: string; createdAt: string; paymentMethod: string };

export default function AccountPage() {
  const router = useRouter();
  const { wishlist } = useStore();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [tab, setTab] = useState<"orders" | "wishlist" | "addresses">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [addresses, setAddresses] = useState<{ label: string; line: string }[]>([]);
  const [newAddr, setNewAddr] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("b7_user");
      if (!raw) { router.push("/login"); return; }
      const u = JSON.parse(raw);
      setUser(u);
      setAddresses(JSON.parse(localStorage.getItem("b7_addresses") || "[]"));
      // Fetch real order history from Postgres (filtered by email)
      fetch(`/api/orders?email=${encodeURIComponent(u.email)}`)
        .then((r) => r.json())
        .then((d) => setOrders(d.orders || []))
        .catch(() => setOrders([]))
        .finally(() => setLoadingOrders(false));
    } catch {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    localStorage.setItem("b7_addresses", JSON.stringify(addresses));
  }, [addresses]);

  if (!user) return <div className="max-w-4xl mx-auto px-4 py-24"><div className="skeleton h-40 rounded-3xl" /></div>;

  const wishedProducts = PRODUCTS.filter((p) => wishlist.includes(p.slug));

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10">
      <div className="bg-gradient-to-r from-[#1c1503] to-[#101010] border border-[#D4A017]/25 rounded-3xl p-6 sm:p-8 flex flex-wrap items-center gap-5">
        <span className="w-16 h-16 rounded-full gold-bg grid place-items-center text-black font-black text-2xl">{user.name[0]?.toUpperCase()}</span>
        <div className="flex-1 min-w-[200px]">
          <h1 className="font-display font-black text-2xl">Hey, {user.name} ★</h1>
          <p className="text-white/55 text-sm">{user.email} • Star Club member</p>
        </div>
        <button
          onClick={() => { localStorage.removeItem("b7_user"); router.push("/login"); }}
          className="ghost-btn rounded-full px-5 py-2.5 text-[13px] font-bold flex items-center gap-2 text-white"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>

      <div className="flex gap-2 mt-6 overflow-x-auto">
        {[
          { id: "orders", icon: Package, label: "Order History" },
          { id: "wishlist", icon: Heart, label: `Wishlist (${wishedProducts.length})` },
          { id: "addresses", icon: MapPin, label: "Saved Addresses" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)} className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold whitespace-nowrap transition-all ${tab === t.id ? "gold-bg text-black" : "bg-[#1A1A1A] text-white/70 border border-white/10"}`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "orders" && (
          <div className="space-y-3.5">
            {loadingOrders ? (
              <><div className="skeleton h-24 rounded-2xl" /><div className="skeleton h-24 rounded-2xl" /></>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-[#141414] border border-white/8 rounded-3xl">
                <ShoppingBag size={36} className="mx-auto text-white/25" />
                <p className="font-display font-bold text-xl mt-4">No orders yet</p>
                <p className="text-white/55 text-sm mt-1">Your order history will appear here after checkout.</p>
                <Link href="/shop" className="gold-btn rounded-full px-7 py-3 text-sm inline-block mt-5">Start shopping</Link>
              </div>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="bg-[#141414] border border-white/8 rounded-2xl p-5 flex flex-wrap items-center gap-4">
                  <span className="w-12 h-12 rounded-2xl bg-[#D4A017]/15 grid place-items-center"><Package size={20} className="text-[#F5C542]" /></span>
                  <div className="flex-1 min-w-[180px]">
                    <p className="font-black gold-text">{o.orderNumber}</p>
                    <p className="text-[13px] text-white/50">{new Date(o.createdAt).toLocaleDateString()} • {o.paymentMethod} • <span className="capitalize text-green-400">{o.status}</span></p>
                  </div>
                  <p className="font-display font-black text-lg">{formatPrice(Number(o.total))}</p>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "wishlist" && (
          wishedProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#141414] border border-white/8 rounded-3xl">
              <Heart size={36} className="mx-auto text-white/25" />
              <p className="font-display font-bold text-xl mt-4">Wishlist is empty</p>
              <Link href="/shop" className="gold-btn rounded-full px-7 py-3 text-sm inline-block mt-5">Find something to love</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {wishedProducts.map((p) => (
                <Link key={p.slug} href={`/product/${p.slug}`} className="bg-[#141414] border border-white/8 rounded-2xl p-4 flex gap-3 hover:border-[#F5C542]/40 transition-all">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images[0]} alt={p.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="min-w-0"><p className="font-bold text-sm truncate">{p.name}</p><p className="gold-text font-black text-sm mt-1">{formatPrice(p.price)}</p></div>
                </Link>
              ))}
            </div>
          )
        )}

        {tab === "addresses" && (
          <div className="bg-[#141414] border border-white/8 rounded-3xl p-6">
            <h3 className="font-display font-bold text-lg flex items-center gap-2"><UserIcon size={18} className="text-[#F5C542]" /> Delivery addresses</h3>
            <div className="space-y-2.5 mt-4">
              {addresses.length === 0 && <p className="text-white/50 text-sm">No saved addresses. Add your first one below — it speeds up checkout.</p>}
              {addresses.map((a, i) => (
                <div key={i} className="flex items-center gap-3 bg-black border border-white/10 rounded-xl px-4 py-3">
                  <MapPin size={16} className="text-[#F5C542] shrink-0" />
                  <div className="flex-1 min-w-0"><p className="font-bold text-sm">{a.label}</p><p className="text-[13px] text-white/55 truncate">{a.line}</p></div>
                  <button onClick={() => setAddresses((v) => v.filter((_, j) => j !== i))} className="p-2 text-white/40 hover:text-red-400" aria-label="Delete address"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <input value={newAddr} onChange={(e) => setNewAddr(e.target.value)} placeholder="e.g. Home — 12 Star Ave, New York, NY 10001" className="flex-1 bg-black border border-white/12 rounded-xl px-4 py-3 text-sm focus:border-[#F5C542]/60 focus:outline-none" aria-label="New address" />
              <button onClick={() => { if (newAddr.trim()) { setAddresses((v) => [...v, { label: `Address ${v.length + 1}`, line: newAddr.trim() }]); setNewAddr(""); } }} className="gold-btn rounded-xl px-5 text-sm flex items-center gap-1.5"><Plus size={15} /> Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
