import axios from "axios"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiErrorMessage(error: unknown, fallback = "Ocorreu um erro inesperado."): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback
  }
  return fallback
}
