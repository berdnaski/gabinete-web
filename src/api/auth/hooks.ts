import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthApi, type RegisterRequest } from ".";

export function useForgotPassword() {
	return useMutation({
		mutationFn: (email: string) => AuthApi.forgotPassword(email)
	})
}

export function useResetPassword() {
	return useMutation({
		mutationFn: (data: { token: string; password: string }) => AuthApi.resetPassword(data)
	})
}

export function useRegister() {
	return useMutation({
		mutationFn: (data: RegisterRequest) => AuthApi.register(data)
	})
}

export function useGetUserProfile() {
	return useQuery({
		queryKey: ["user-profile"],
		queryFn: () => AuthApi.getUserProfile()
	})
}