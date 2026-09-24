import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// In-memory fallback database for dev/preview and offline resilience
export const inMemoryStore = {
  orders: [] as any[],
  orderItems: [] as any[],
  newsletterSubscribers: [] as any[],
  contactMessages: [] as any[],
  productReviews: [
    {
      id: 1,
      productSlug: "apex-pro-phone",
      author: "Marcus Vance",
      rating: 5,
      title: "Best phone purchase this year",
      body: "Screen is blindingly bright in daylight and battery lasts a full 2 days. The titanium edge feels like a $1500 flagship.",
      verified: true,
      createdAt: new Date("2026-08-15"),
    },
    {
      id: 2,
      productSlug: "zenith-anc-headphones",
      author: "Elena Rostova",
      rating: 5,
      title: "ANC is completely silent",
      body: "Flight tested on an 8 hour route — total bliss. Memory foam ear cushions are the softest I've worn.",
      verified: true,
      createdAt: new Date("2026-08-20"),
    },
    {
      id: 3,
      productSlug: "pulsar-pro-smartwatch",
      author: "David K.",
      rating: 5,
      title: "Better battery than Apple Watch Ultra",
      body: "14 days battery life is real. Heart rate tracking matches my chest strap perfectly. Highly recommend!",
      verified: true,
      createdAt: new Date("2026-09-02"),
    },
  ] as any[],
};

let nextOrderId = 1;
let nextItemId = 1;
let nextReviewId = 10;
let nextMessageId = 1;
let nextNewsletterId = 1;

function getStoreForTable(table: any): any[] | null {
  const tableName =
    table?.tableName ||
    table?._?.name ||
    table?.name ||
    (typeof table === "object" && table ? Object.values(table).find((v) => typeof v === "string") : null);

  const nameStr = String(tableName || "").toLowerCase();
  if (nameStr.includes("order_item") || nameStr.includes("orderitems")) return inMemoryStore.orderItems;
  if (nameStr.includes("order")) return inMemoryStore.orders;
  if (nameStr.includes("newsletter")) return inMemoryStore.newsletterSubscribers;
  if (nameStr.includes("contact")) return inMemoryStore.contactMessages;
  if (nameStr.includes("review")) return inMemoryStore.productReviews;
  return null;
}

function createMockQuery(initialAction: "select" | "insert", initialArgs?: any) {
  let targetTable: any = null;
  const action = initialAction;
  let valuesToInsert: any = initialArgs;
  let whereClause: any = null;
  let limitNum = 50;

  const chain: any = {
    from: (table: any) => {
      targetTable = table;
      return chain;
    },
    where: (clause: any) => {
      whereClause = clause;
      return chain;
    },
    orderBy: (..._args: any[]) => chain,
    limit: (l: number) => {
      limitNum = l;
      return chain;
    },
    values: (val: any) => {
      valuesToInsert = val;
      return chain;
    },
    returning: (_fields?: any) => chain,
    then: (resolve: (val: any) => void) => {
      if (action === "select") {
        const store = getStoreForTable(targetTable) || inMemoryStore.productReviews;
        let res = [...store];

        if (whereClause) {
          try {
            const colName = whereClause?.left?.name || whereClause?.column?.name;
            const targetVal = whereClause?.right?.value !== undefined ? whereClause.right.value : whereClause?.value;
            if (colName && targetVal !== undefined) {
              res = res.filter((item) => String(item[colName] ?? item.email ?? item.productSlug) === String(targetVal));
            }
          } catch {
            // keep items if filter parsing fails
          }
        }
        resolve(res.slice(0, limitNum));
      } else if (action === "insert") {
        const store = getStoreForTable(targetTable);
        const records = Array.isArray(valuesToInsert) ? valuesToInsert : [valuesToInsert];
        const insertedList: any[] = [];

        for (const item of records) {
          const newRecord = {
            id:
              store === inMemoryStore.orders
                ? nextOrderId++
                : store === inMemoryStore.orderItems
                ? nextItemId++
                : store === inMemoryStore.productReviews
                ? nextReviewId++
                : store === inMemoryStore.contactMessages
                ? nextMessageId++
                : nextNewsletterId++,
            createdAt: new Date().toISOString(),
            ...item,
          };
          if (store) store.push(newRecord);
          insertedList.push(newRecord);
        }
        resolve(insertedList);
      } else {
        resolve([]);
      }
    },
  };

  return chain;
}

const mockDb: any = {
  select: () => createMockQuery("select"),
  insert: (table: any) => {
    const q = createMockQuery("insert");
    q.from(table);
    return q;
  },
  execute: async () => ({ rows: [{ "?column?": 1 }] }),
  query: new Proxy(
    {},
    {
      get: () => ({
        findMany: async () => [],
        findFirst: async () => null,
        findUnique: async () => null,
        create: async (d: any) => d?.data ?? {},
        update: async (d: any) => d?.data ?? {},
        delete: async () => ({}),
      }),
    }
  ),
};

const databaseUrl = process.env.DATABASE_URL;

let realDb: any = null;
let poolInstance: Pool | null = null;

if (databaseUrl && databaseUrl.trim() !== "") {
  try {
    const globalForDb = globalThis as typeof globalThis & {
      __arenaNextJsPostgresqlPool?: Pool;
    };

    poolInstance =
      globalForDb.__arenaNextJsPostgresqlPool ??
      new Pool({
        connectionString: databaseUrl,
        connectionTimeoutMillis: 3000,
      });

    if (process.env.NODE_ENV !== "production") {
      globalForDb.__arenaNextJsPostgresqlPool = poolInstance;
    }

    realDb = drizzle(poolInstance);
  } catch (err) {
    console.warn("[AI Studio] Failed to initialize PostgreSQL pool, falling back to mock DB:", err);
    realDb = null;
  }
}

export const pool = poolInstance;

export const db: any = realDb ?? mockDb;
