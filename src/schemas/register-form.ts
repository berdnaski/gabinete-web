import z from "zod";

export const registerFormSchema = z.object({
  name: z
    .string({ error: "Campo obrigatório." })
    .min(4, { error: "Nome deve ter no mínimo 4 caracteres." }),
  email: z.email({ error: "Digite um e-mail válido." }),
  password: z.string().min(6, {
    error: "Insira uma senha com no mínimo 6 caracteres.",
  }),
});

export type RegisterFormData = z.infer<typeof registerFormSchema>