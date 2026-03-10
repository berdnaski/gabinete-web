import { useMutation } from "@tanstack/react-query";
import { AuthApi, type RegisterRequest } from ".";

export function useRegister() {
    return useMutation({
        mutationFn: (data: RegisterRequest) => AuthApi.register(data)
    })
}