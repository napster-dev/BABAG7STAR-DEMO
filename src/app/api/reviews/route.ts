import { NextResponse } from "next/server";
import { db } from "@/db";
import { productReviews } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/reviews?slug=x — list reviews for a product
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || "";
    if (!slug) return NextResponse.json({ reviews: [] });
    const rows = await db.select().from(productReviews).where(eq(productReviews.productSlug, slug)).orderBy(desc(productReviews.createdAt)).limit(20);
    return NextResponse.json({ reviews: rows });
  } catch (e) {
    console.error("reviews GET failed", e);
    return NextResponse.json({ reviews: [] });
  }
}

// POST /api/reviews — submit a review (moderate before publishing in production)
export async function POST(req: Request) {
  try {
    const { productSlug, author, rating, title, body } = await req.json();
    if (!productSlug || !author || !body || !(rating >= 1 && rating <= 5)) {
      return NextResponse.json({ error: "Missing review fields." }, { status: 400 });
    }
    await db.insert(productReviews).values({
      productSlug: String(productSlug).slice(0, 160),
      author: String(author).slice(0, 160),
      rating: Number(rating),
      title: title ? String(title).slice(0, 255) : null,
      body: String(body).slice(0, 2000),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("reviews POST failed", e);
    return NextResponse.json({ error: "Could not save review." }, { status: 500 });
  }
}
