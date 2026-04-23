import { z } from "zod";

const LoginFrom = z.object({
  email: z.email(),
  password: z.string().min(8, "password should contain atleast 8 characters!"),
});


export type LoginType = z.infer<typeof LoginFrom>;