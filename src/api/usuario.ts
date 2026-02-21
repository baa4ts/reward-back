import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import z from "zod";
import { hashPassword } from "../helper/hashPassword";
import { insDB } from "../helper/insDB";
import { user_table } from "../ORM/schema";
import { type UserLogin, userLoginSchema } from "../ZOD/user.post";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (c) => {
	try {
		const body = await c.req.json();
		const data: UserLogin = userLoginSchema.parse(body);

		const db = insDB(c);
		const passhash: string = await hashPassword(data.password);

		const [usuario] = await db.select().from(user_table).where(eq(user_table.id, data.id));

		if (!usuario || usuario.passhash !== passhash) {
			return c.json(
				{
					status: "failed",
					msg: "Credenciales invalidas o inexistentes",
					token: null,
					response: null,
				},
				401,
			);
		}

		const token = await sign(
			{
				sub: `${usuario.id}`,
				role: usuario.role,
				exp: Math.floor(Date.now() / 1000) + 60 * 60,
			},
			c.env.JWT_SECRET,
			"HS256",
		);

		await c.env.REWARD.put(`${usuario.id}`, usuario.role, { expirationTtl: 3600 });

		return c.json(
			{
				status: "ok",
				msg: null,
				token,
				response: { id: usuario.id, role: usuario.role },
			},
			200,
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return c.json(
				{
					status: "failed",
					msg: error.issues.map((i) => i.message).join(", "),
					token: null,
					response: null,
				},
				400,
			);
		}

		return c.json(
			{
				status: "failed",
				msg: "Error en el servidor",
				token: null,
				response: null,
			},
			500,
		);
	}
});

export { app as usuario_route };
