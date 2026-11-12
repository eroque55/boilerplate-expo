import z from './zod';

export const LoginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1),
  requestRefresh: z.boolean(),
});

export type LoginForm = z.infer<typeof LoginSchema>;
