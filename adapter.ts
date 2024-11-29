import {
  db,
  user as usersTable,
  account as accountsTable,
  session as sessionsTable,
  eq,
  and,
} from "astro:db";
import {} from "@astrojs/db/utils";

import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
} from "@auth/core/adapters";
import type { Awaitable } from "@auth/core/types";

export const AstroDBAdapter = (): Adapter => {
  return {
    async createUser(data: AdapterUser) {
      const { id, ...insertData } = data;

      return db
        .insert(usersTable)
        .values({
          ...insertData,
          emailVerified: insertData.emailVerified?.valueOf(),
        })
        .returning()
        .get() as Awaitable<AdapterUser>;
    },
    async getUser(userId: string) {
      const result =
        (await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, userId))
          .get()) ?? null;

      return result as Awaitable<AdapterUser | null>;
    },
    async getUserByEmail(email: string) {
      const result =
        (await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, email))
          .get()) ?? null;

      return result as Awaitable<AdapterUser | null>;
    },
    async createSession(data: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }) {
      const result = await db
        .insert(sessionsTable)
        .values({
          ...data,
          expires: data.expires.valueOf(),
        })
        .returning()
        .get();

      return {
        sessionToken: result.sessionToken,
        userId: result.userId,
        expires: new Date(result.expires),
      };
    },
    async getSessionAndUser(sessionToken: string) {
      const result =
        (await db
          .select({
            session: sessionsTable,
            user: usersTable,
          })
          .from(sessionsTable)
          .where(eq(sessionsTable.sessionToken, sessionToken))
          .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
          .get()) ?? null;

      return result as Awaitable<{
        session: AdapterSession;
        user: AdapterUser;
      } | null>;
    },
    async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      if (!data.id) {
        throw new Error("No user id.");
      }

      const result = await db
        .update(usersTable)
        .set({
          ...data,
          emailVerified: data.emailVerified?.valueOf(),
        })
        .where(eq(usersTable.id, data.id))
        .returning()
        .get();

      if (!result) {
        throw new Error("User not found.");
      }

      return result as Awaitable<AdapterUser>;
    },
    async updateSession(
      data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">,
    ) {
      const result = await db
        .update(sessionsTable)
        .set({
          ...data,
          expires: data.expires?.valueOf(),
        })
        .where(eq(sessionsTable.sessionToken, data.sessionToken))
        .returning()
        .get();

      if (!result) {
        null;
      }

      return {
        sessionToken: result.sessionToken,
        userId: result.userId,
        expires: new Date(result.expires),
      };
    },
    async linkAccount(data: AdapterAccount) {
      await db.insert(accountsTable).values(data).run();
    },
    async getUserByAccount(
      account: Pick<AdapterAccount, "provider" | "providerAccountId">,
    ) {
      const result = await db
        .select({
          account: accountsTable,
          user: usersTable,
        })
        .from(accountsTable)
        .innerJoin(usersTable, eq(accountsTable.userId, usersTable.id))
        .where(
          and(
            eq(accountsTable.provider, account.provider),
            eq(accountsTable.providerAccountId, account.providerAccountId),
          ),
        )
        .get();

      const user = result?.user ?? null;

      return user as Awaitable<AdapterUser | null>;
    },
    async deleteSession(sessionToken: string) {
      await db
        .delete(sessionsTable)
        .where(eq(sessionsTable.sessionToken, sessionToken))
        .run();
    },
    async deleteUser(id: string) {
      await db.delete(usersTable).where(eq(usersTable.id, id)).run();
    },
    async unlinkAccount(
      params: Pick<AdapterAccount, "provider" | "providerAccountId">,
    ) {
      await db
        .delete(accountsTable)
        .where(
          and(
            eq(accountsTable.provider, params.provider),
            eq(accountsTable.providerAccountId, params.providerAccountId),
          ),
        )
        .run();
    },
    async getAccount(providerAccountId: string, provider: string) {
      return db
        .select()
        .from(accountsTable)
        .where(
          and(
            eq(accountsTable.provider, provider),
            eq(accountsTable.providerAccountId, providerAccountId),
          ),
        )
        .then((res) => res[0] ?? null) as Promise<AdapterAccount | null>;
    },
  };
};
