import { drizzle } from "drizzle-orm/libsql/web";
import type { Context } from "hono";

export function insDB(c: Context<{ Bindings: Bindings }>) {
	return drizzle({
		connection: {
			url: c.env.TURSO_DATABASE_URL,
			authToken: c.env.TURSO_AUTH_TOKEN,
		},
	});
}
