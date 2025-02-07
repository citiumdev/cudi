import { defineDb, defineTable, column as c, sql } from "astro:db";

const user = defineTable({
  columns: {
    id: c.text({
      primaryKey: true,
      default: sql`(select uuid4())`,
    }),
    role: c.text({
      default: "user",
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

const event = defineTable({
  columns: {
    id: c.text({
      primaryKey: true,
      default: sql`(select uuid4())`,
    }),
    name: c.text(),
    image: c.text(),
    date: c.number(),
    duration: c.number(),
    done: c.boolean({ default: false }),
    active: c.boolean({ default: false }),
    limit: c.number({
      optional: true,
    }),
    type: c.text({
      default: "workshop", // workshop, talk
    }),
  },
});

const eventPresenters = defineTable({
  columns: {
    eventId: c.text(),
    userId: c.text(),
  },
  foreignKeys: [
    {
      columns: ["eventId"],
      references: () => [event.columns.id],
    },
    {
      columns: ["userId"],
      references: () => [user.columns.id],
    },
  ],
});

const eventParticipants = defineTable({
  columns: {
    eventId: c.text(),
    userId: c.text(),
  },
  foreignKeys: [
    {
      columns: ["eventId"],
      references: () => [event.columns.id],
    },
    {
      columns: ["userId"],
      references: () => [user.columns.id],
    },
  ],
});

const certificate = defineTable({
  columns: {
    id: c.text({
      primaryKey: true,
      default: sql`(select uuid4())`,
    }),
    userId: c.text(),
    eventId: c.text(),
    hashKey: c.text({
      optional: true,
    }),
  },
  foreignKeys: [
    {
      columns: ["userId"],
      references: () => [user.columns.id],
    },
    {
      columns: ["eventId"],
      references: () => [event.columns.id],
    },
  ],
});

export default defineDb({
  tables: {
    user,
    account,
    session,
    event,
    eventPresenters,
    eventParticipants,
    certificate,
  },
});
