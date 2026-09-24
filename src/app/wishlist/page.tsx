"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useStore } from "@/store/StoreContext";
import { PRODUCTS } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { wishlist } = useStore();
  const items = PRODUCTS.filter((p) => wishlist.includes(p.slug));

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 min-h-[60vh]">
      <h1 className="font-display font-black text-3xl sm:text-4xl">Your <span className="gold-text">Wishlist</span> <span className="text-white/40 text-xl">({items.length})</span></h1>
      <p className="text-white/55 mt-2">Saved for later — synced on this device.</p>
      {items.length === 0 ? (
        <div className="text-center py-20 bg-[#141414] border border-white/8 rounded-3xl mt-8">
          <Heart size={40} className="mx-auto text-white/20" />
          <h2 className="font-display font-black text-2xl mt-4">Nothing saved yet</h2>
          <p className="text-white/55 mt-2">Tap the heart on any product to keep it here.</p>
          <Link href="/shop" className="gold-btn rounded-full px-8 py-3.5 text-sm inline-flex items-center gap-2 mt-6">Discover products <ArrowRight size={15} /></Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-8">
          {items.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
