import { defineDb, defineTable, column as c, sql } from "astro:db";

const user = defineTable({
  columns: {
    id: c.text({
      primaryKey: true,
      default: sql`select uuid4()`,
    }),
    name: c.text({
      optional: true,
    }),
    email: c.text({ unique: true, optional: true }),
    emailVerified: c.number({ optional: true }),
    image: c.text({ optional: true }),
  },
});

const account = defineTable({
  columns: {
    userId: c.text(),
    type: c.text(),
    provider: c.text(),
    providerAccountId: c.text(),
    refresh_token: c.text({ optional: true }),
    access_token: c.text({ optional: true }),
    expires_at: c.number({ optional: true }),
    token_type: c.text({ optional: true }),
    scope: c.text({ optional: true }),
    id_token: c.text({ optional: true }),
    session_state: c.text({ optional: true }),
  },
  foreignKeys: [
    {
      columns: ["userId"],
      references: () => [user.columns.id],
    },
  ],
});

const session = defineTable({
  columns: {
    sessionToken: c.text({
      primaryKey: true,
    }),
    userId: c.text(),
    expires: c.number(),
  },
  foreignKeys: [
    {
      columns: ["userId"],
      references: () => [user.columns.id],
    },
  ],
});

const verificationToken = defineTable({
  columns: {
    identifier: c.text(),
    token: c.text(),
    expires: c.number(),
  },
  indexes: [
    {
      on: ["identifier", "token"],
    },
  ],
});

const authenticator = defineTable({
  columns: {
    cedentialID: c.text({ unique: true }),
    userId: c.text(),
    providerAccountId: c.text(),
    credentialPublicKey: c.text(),
    counter: c.number(),
    credentialDeviceType: c.text(),
    credentialBackedUp: c.number(),
    transports: c.text(),
  },
  foreignKeys: [
    {
      columns: ["userId"],
      references: () => [user.columns.id],
    },
  ],
});

export default defineDb({
  tables: {
    user,
    account,
    session,
    verificationToken,
    authenticator,
  },
});
