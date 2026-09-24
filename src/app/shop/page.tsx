import { Suspense } from "react";
import ShopClient from "./shop-client";

export const metadata = {
  title: "Shop All — Premium Electronics & Gadgets",
  description: "Browse all BabaG7Star products. Filter by category, price, rating. Phones, audio, wearables, drones, home tech & accessories.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="max-w-[1280px] mx-auto px-4 py-20 grid grid-cols-2 lg:grid-cols-4 gap-5">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />)}</div>}>
      <ShopClient />
    </Suspense>
  );
}
