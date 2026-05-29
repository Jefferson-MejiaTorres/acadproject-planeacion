import { pgTable, text, timestamp, boolean, date, unique } from "drizzle-orm/pg-core"

// Better Auth tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// AcadProject tables
export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("activo"),
  createdBy: text("createdBy").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const projectMembers = pgTable(
  "project_members",
  {
    id: text("id").primaryKey(),
    projectId: text("projectId").notNull(),
    userId: text("userId").notNull(),
    role: text("role").default("colaborador"),
    joinedAt: timestamp("joinedAt").defaultNow(),
  },
  (table) => [unique().on(table.projectId, table.userId)]
)

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  projectId: text("projectId").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("pendiente"),
  assignedTo: text("assignedTo"),
  dueDate: date("dueDate"),
  createdBy: text("createdBy").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message"),
  read: boolean("read").default(false),
  link: text("link"),
  createdAt: timestamp("createdAt").defaultNow(),
})

// Types
export type User = typeof user.$inferSelect
export type Project = typeof projects.$inferSelect
export type ProjectMember = typeof projectMembers.$inferSelect
export type Task = typeof tasks.$inferSelect
export type Notification = typeof notifications.$inferSelect
