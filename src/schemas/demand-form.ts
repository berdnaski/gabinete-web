import { DemandPriority } from "@/types/demand-types";
import z from "zod";

const locationSchema = z.object({
  address: z.string().min(1, "Selecione um endereço no mapa"),
  latitude: z.string().min(1, ""),
  longitude: z.string().min(1, ""),
  zipcode: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export const demandSchema = z.object({
  title: z.string().min(3, "O título deve conter no mínimo 3 caracteres"),
  description: z
    .string()
    .min(10, "A descrição deve conter no mínimo 10 caracteres"),
  categoryId: z.string({
    error: "Selecione uma categoria",
  }),
  priority: z.enum(Object.values(DemandPriority) as [string, ...string[]]).optional(),
  location: locationSchema,
  files: z
    .array(z.instanceof(File), { error: "Envie pelo menos um arquivo" })
    .min(1, "Envie pelo menos um arquivo"),
});

export type DemandFormData = z.infer<typeof demandSchema>;
