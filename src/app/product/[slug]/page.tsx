import { PRODUCTS } from "@/data/products";
import ProductClient from "./product-client";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) return { title: "Product not found | BabaG7Star" };
  return {
    title: `${p.name} — ${p.price} | BabaG7Star`,
    description: `${p.tagline} ${p.description.slice(0, 140)}`,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductClient slug={slug} />;
}
