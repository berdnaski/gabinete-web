import { z } from "zod";

export const personalInfoSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  phone: z.string(),
});

export interface PersonalInfoData {
  name: string;
  phone: string;
}

export const cabinetInfoSchema = z.object({
  name: z.string().min(3, "O nome do gabinete deve ter pelo menos 3 caracteres"),
  description: z.string().max(1000, "A descrição deve ter no máximo 1000 caracteres"),
  email: z.string().email("E-mail inválido").or(z.literal("")),
});

export interface CabinetInfoData {
  name: string;
  description: string;
  email: string;
}

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, "A nova senha deve ter pelo menos 8 caracteres"),
});

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
