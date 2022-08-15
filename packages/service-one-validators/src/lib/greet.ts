import { z } from "zod";

export const greetInputSchema = z.string();

export type GreetInput = z.infer<typeof greetInputSchema>;
