import { count, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import z from "zod";
import { insDB } from "../helper/insDB";
import { sessionMiddleware } from "../Middleware/Session.middleware";
import { reward_table } from "../ORM/schema";
import {
	type PostReward,
	postRewardSchema,
	type UpdateReward,
	updateRewardSchema,
} from "../ZOD/reward.post";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
	try {
		const limit = Number(c.req.query("limit") || 6);
		const page = Number(c.req.query("page") || 1);

		const db = insDB(c);

		const [{ totalCount }] = await db.select({ totalCount: count() }).from(reward_table);

		const rewards = await db
			.select()
			.from(reward_table)
			.limit(limit)
			.offset((page - 1) * limit);

		return c.json(
			{
				status: "ok",
				msg: null,
				token: null,
				response: {
					totalPages: Math.ceil(totalCount / limit),
					data: rewards,
				},
			},
			200,
		);
	} catch (_error) {
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

app.post("/", sessionMiddleware(["admin"]), async (c) => {
	try {
		const body = await c.req.json();
		const data: PostReward = postRewardSchema.parse(body);

		const db = insDB(c);
		const result = await db.insert(reward_table).values(data).returning({ id: reward_table.id });

		return c.json(
			{
				status: "ok",
				msg: null,
				token: null,
				response: { data: result },
			},
			201,
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

app.delete("/:id", sessionMiddleware(["admin"]), async (c) => {
	try {
		const id = Number(c.req.param("id"));

		if (Number.isNaN(id)) {
			return c.json(
				{
					status: "failed",
					msg: "ID invalido",
					token: null,
					response: null,
				},
				400,
			);
		}

		const db = insDB(c);
		const result = await db
			.delete(reward_table)
			.where(eq(reward_table.id, id))
			.returning({ id: reward_table.id });

		if (result.length === 0) {
			return c.json(
				{
					status: "failed",
					msg: "Reward no encontrado",
					token: null,
					response: null,
				},
				404,
			);
		}

		return c.json(
			{
				status: "ok",
				msg: null,
				token: null,
				response: { data: result },
			},
			200,
		);
	} catch (_error) {
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

app.patch("/:id/toggle", sessionMiddleware(["admin"]), async (c) => {
	try {
		const id = Number(c.req.param("id"));

		if (Number.isNaN(id)) {
			return c.json(
				{
					status: "failed",
					msg: "ID invalido",
					token: null,
					response: null,
				},
				400,
			);
		}

		const db = insDB(c);
		const result = await db
			.update(reward_table)
			.set({ active: sql`NOT ${reward_table.active}` })
			.where(eq(reward_table.id, id))
			.returning({ id: reward_table.id, active: reward_table.active });

		if (result.length === 0) {
			return c.json(
				{
					status: "failed",
					msg: "Reward no encontrado",
					token: null,
					response: null,
				},
				404,
			);
		}

		return c.json(
			{
				status: "ok",
				msg: null,
				token: null,
				response: { data: result },
			},
			200,
		);
	} catch (_error) {
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

app.put("/:id", sessionMiddleware(["admin"]), async (c) => {
	try {
		const id = Number(c.req.param("id"));

		if (Number.isNaN(id)) {
			return c.json(
				{
					status: "failed",
					msg: "ID invalido",
					token: null,
					response: null,
				},
				400,
			);
		}

		const body = await c.req.json<UpdateReward>();
		const data: UpdateReward = updateRewardSchema.parse(body);

		const db = insDB(c);
		const result = await db
			.update(reward_table)
			.set(data)
			.where(eq(reward_table.id, id))
			.returning({ id: reward_table.id });

		if (result.length === 0) {
			return c.json(
				{
					status: "failed",
					msg: "Reward no encontrado",
					token: null,
					response: null,
				},
				404,
			);
		}

		return c.json(
			{
				status: "ok",
				msg: null,
				token: null,
				response: { data: result },
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

export { app as reward_route };
