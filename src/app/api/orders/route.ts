import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/orders?email=x — order history for account page
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) return NextResponse.json({ orders: [] });
    const rows = await db.select().from(orders).where(eq(orders.email, email)).orderBy(desc(orders.createdAt)).limit(20);
    return NextResponse.json({ orders: rows });
  } catch (e) {
    console.error("orders GET failed", e);
    return NextResponse.json({ orders: [] });
  }
}

// POST /api/orders — create order at checkout
// PRODUCTION: create a Stripe PaymentIntent first, confirm on client, then verify webhook before fulfilling.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, firstName, lastName, address, city, postcode, country, phone, paymentMethod, promoCode, items } = body;

    if (!email || !firstName || !address || !city || !postcode || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing required order fields." }, { status: 400 });
    }

    const PROMOS: Record<string, number> = { B7STAR10: 0.1, STAR15: 0.15, WELCOME5: 0.05 };
    const subtotal = items.reduce((a: number, i: { price: number; qty: number }) => a + Number(i.price) * Number(i.qty), 0);
    const rate = promoCode && PROMOS[String(promoCode).toUpperCase()] ? PROMOS[String(promoCode).toUpperCase()] : 0;
    const discount = subtotal * rate;
    const shipping = subtotal - discount >= 75 ? 0 : 4.95;
    const total = Math.max(0, subtotal - discount + shipping);
    const orderNumber = `B7-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;

    const [created] = await db
      .insert(orders)
      .values({
        orderNumber,
        email: String(email).slice(0, 255),
        firstName: String(firstName).slice(0, 120),
        lastName: String(lastName || "").slice(0, 120),
        address: String(address).slice(0, 255),
        city: String(city).slice(0, 120),
        postcode: String(postcode).slice(0, 32),
        country: String(country || "United States").slice(0, 120),
        phone: phone ? String(phone).slice(0, 64) : null,
        paymentMethod: String(paymentMethod || "card").slice(0, 64),
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        discount: discount.toFixed(2),
        total: total.toFixed(2),
        promoCode: promoCode ? String(promoCode).toUpperCase().slice(0, 64) : null,
        status: "confirmed",
      })
      .returning({ id: orders.id });

    if (created?.id) {
      await db.insert(orderItems).values(
        items.map((i: { slug: string; name: string; variant?: string; qty: number; price: number }) => ({
          orderId: created.id,
          productSlug: String(i.slug).slice(0, 160),
          productName: String(i.name).slice(0, 255),
          variant: i.variant ? String(i.variant).slice(0, 255) : null,
          qty: Number(i.qty),
          unitPrice: Number(i.price).toFixed(2),
        }))
      );
    }

    return NextResponse.json({ ok: true, orderNumber, total: `$${total.toFixed(2)}` });
  } catch (e) {
    console.error("orders POST failed", e);
    return NextResponse.json({ error: "Could not place order. Please try again." }, { status: 500 });
  }
}
