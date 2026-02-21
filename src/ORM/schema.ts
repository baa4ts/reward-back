import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reward_table = sqliteTable("reward_table", {
	id: int().primaryKey({ autoIncrement: true }),
	icon: text()
		.notNull()
		.default("https://i.pinimg.com/1200x/f1/04/64/f1046492b7da35efc8f53081d5aed56c.jpg"),
	bg: text().notNull().default("bg-gradient-to-r from-violet-600 to-indigo-600"),
	link: text().notNull(),
	active: int({ mode: "boolean" }).notNull().default(true),
	date: int({ mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const user_table = sqliteTable("user_table", {
	id: int().primaryKey({ autoIncrement: true }),
	role: text().notNull().default("user"),
	passhash: text().notNull(),
});
