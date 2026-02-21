import z from "zod";

const urlCoerce = z.coerce.string().pipe(z.string().url());

const rewardSchema = z.object({
	icon: urlCoerce.optional(),
	bg: z.coerce.string().optional(),
	link: urlCoerce,
});

export const updateRewardSchema = z.object({
	icon: urlCoerce.optional(),
	bg: z.coerce.string().optional(),
	link: urlCoerce.optional(),
});

export type UpdateReward = z.infer<typeof updateRewardSchema>;

export const postRewardSchema = z.array(rewardSchema);

export type Reward = z.infer<typeof rewardSchema>;
export type PostReward = z.infer<typeof postRewardSchema>;
