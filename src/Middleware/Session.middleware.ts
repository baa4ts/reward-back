import { createFactory } from "hono/factory";
import { verify } from "hono/jwt";

const factory = createFactory<{ Bindings: Bindings }>();

export const sessionMiddleware = (requiredRoles: string[]) =>
	factory.createMiddleware(async (c, next) => {
		const token = c.req.header("Authorization")?.replace("Bearer ", "");
		if (!token)
			return c.json(
				{
					status: "failed",
					msg: "Sin token",
					token: null,
					response: null,
				},
				401,
			);

		try {
			const payload = await verify(token, c.env.JWT_SECRET, "HS256");
			const id = payload.sub;

			const role = await c.env.REWARD.get(`${id}`);

			if (!role)
				return c.json(
					{
						status: "failed",
						msg: "Sesion invalida o expirada",
						token: null,
						response: null,
					},
					401,
				);

			if (!requiredRoles.includes(role))
				return c.json(
					{
						status: "failed",
						msg: "No tenes permisos suficientes",
						token: null,
						response: null,
					},
					403,
				);

			await next();
		} catch {
			return c.json(
				{ status: "failed", msg: "Token invalido o expirado", token: null, response: null },
				401,
			);
		}
	});
