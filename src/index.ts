import { Hono } from "hono";
import { cors } from "hono/cors";
import { timeout } from "hono/timeout";
import { reward_route } from "./api/reward";
import { usuario_route } from "./api/usuario";

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

// Cors
app.use("*", (c, next) => {
	return cors({
		origin: c.env.CORS.split(","),
	})(c, next);
});

// Timeout maximo
app.use("*", timeout(6000));

// Rutas de la aplicacion
app.route("/reward", reward_route);
app.route("/user", usuario_route);

export default app;
