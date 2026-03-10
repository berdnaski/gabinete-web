import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useRegister } from "../api/auth/hooks";
import { toast } from "sonner";

const registerFormSchema = z.object({
    cabinetName: z.string({ error: "Campo obrigatório." })
        .min(5, { error: "Nome deve ter no mínimo 5 caracteres." }),
    cabinetSlug: z.string().min(3, { error: "O slug deve ter pelo menos 3 caracteres" }),
    ownerName: z.string({ error: "Campo obrigatório." })
        .min(4, { error: "Nome deve ter no mínimo 4 caracteres." }),
    ownerEmail: z.email({ error: "Digite um e-mail válido." }),
    ownerPassword: z.string().min(6, {
        error: "Insira uma senha com no mínimo 6 caracteres."
    }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export function SignUpForm() {
    const navigate = useNavigate();
    const { mutateAsync: registerCabinet, isPending: isPendingRegisterCabinet, error: registerError } = useRegister();

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            cabinetName: "",
            cabinetSlug: "",
            ownerName: "",
            ownerEmail: "",
            ownerPassword: "",
        }
    })

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const isFormSubmittingOrIsPending = isPendingRegisterCabinet | isSubmitting;

    const onSubmit = handleSubmit(async (data: RegisterFormData) => {
        try {
            await registerCabinet(data);
            toast
        } catch {

        }
    })
}