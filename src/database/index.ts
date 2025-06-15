import {
  integer,
  sqliteTable,
  text,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/libsql";
import type { AdapterAccount } from "next-auth/adapters";
import { env } from "@/env";
import { createClient } from "@libsql/client";
import { Event } from "@/types/Event";
import { User } from "@/types/User";

const client = createClient({
  url: env.DB_URL,
  authToken: env.DB_TOKEN,
});

export const db = drizzle(client);

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  role: text().notNull().$type<User["role"]>().default("user"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ],
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ],
);

export const authenticators = sqliteTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: integer("credentialBackedUp", {
      mode: "boolean",
    }).notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  ],
);

export const events = sqliteTable("event", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  image: text().notNull(),
  date: integer({ mode: "timestamp" }).notNull(),
  duration: integer().notNull(),
  done: integer({ mode: "boolean" }).notNull().default(false),
  active: integer({ mode: "boolean" }).notNull().default(false),
  limit: integer(),
  type: text().notNull().$type<Event["type"]>().default("workshop"),
});

export const presenters = sqliteTable(
  "presenter",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    eventId: text("eventId")
      .notNull()
      .references(() => events.id),
  },
  (presenter) => [
    primaryKey({
      columns: [presenter.userId, presenter.eventId],
    }),
  ],
);

export const participants = sqliteTable(
  "participant",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    eventId: text("eventId")
      .notNull()
      .references(() => events.id),
  },
  (participant) => [
    primaryKey({
      columns: [participant.userId, participant.eventId],
    }),
  ],
);

export const certificates = sqliteTable("certificate", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  eventId: text("eventId")
    .notNull()
    .references(() => events.id),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
}, (table)=> [
    uniqueIndex("certificate_eventId_userId").on(table.eventId, table.userId)
  ]);
