import { pgTable, serial, varchar, text, integer, numeric, timestamp, boolean } from "drizzle-orm/pg-core";

// Orders — created at checkout. Plug Stripe/PayPal webhooks here later.
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 32 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 120 }).notNull(),
  lastName: varchar("last_name", { length: 120 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  postcode: varchar("postcode", { length: 32 }).notNull(),
  country: varchar("country", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  paymentMethod: varchar("payment_method", { length: 64 }).notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shipping: numeric("shipping", { precision: 10, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  promoCode: varchar("promo_code", { length: 64 }),
  status: varchar("status", { length: 32 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productSlug: varchar("product_slug", { length: 160 }).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  variant: varchar("variant", { length: 255 }),
  qty: integer("qty").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  source: varchar("source", { length: 64 }).default("footer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),
  productSlug: varchar("product_slug", { length: 160 }).notNull(),
  author: varchar("author", { length: 160 }).notNull(),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 255 }),
  body: text("body").notNull(),
  verified: boolean("verified").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
