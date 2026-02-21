import { z } from "zod";

export const userLoginSchema = z.object({
	id: z.coerce.number().int().positive(),
	password: z.coerce.string().min(8, "Minimo 8 caracteres").max(128, "Maximo 128 caracteres"),
});

export type UserLogin = z.infer<typeof userLoginSchema>;
