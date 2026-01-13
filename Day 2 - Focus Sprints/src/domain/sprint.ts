import { z } from "zod";

export const SprintSchema = z.object({
  id: z.string().min(1),
  durationMin: z.number().int().positive(),
  finishedAtISO: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid ISO date"),
});

export const SprintsSchema = z.array(SprintSchema);

export type Sprint = z.infer<typeof SprintSchema>;


