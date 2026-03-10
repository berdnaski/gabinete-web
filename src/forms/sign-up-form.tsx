import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"
import { useRegister } from "../api/auth/hooks";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputForm } from "@/components/ui/form/input-form";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/loading";

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

    const isFormSubmittingOrIsPending = isPendingRegisterCabinet || isSubmitting;

    const onSubmit = handleSubmit(async (data: RegisterFormData) => {
        console.log('Dataaaaaaa', data);
        try {
            await registerCabinet(data);
            toast.success("Cadastro realizado com sucesso! Você já pode fazer login.");
            await new Promise(resolve => setTimeout(resolve, 2000));
            navigate("/signIn");
        } catch {
            toast.error("Erro ao realizar cadastro. Tente novamente");
        }
    })

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Transformando dias em conquistas.</h1>
                <p className="text-muted-foreground text-sm text-balance">Insira seus dados para iniciar sua jornada.</p>
            </div>

            <form onSubmit={onSubmit}>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="cabinetName">Nome do gabinete</FieldLabel>
                        <InputForm
                            type="text"
                            name="cabinetName"
                            control={control}
                            autoComplete="organization"
                            placeholder="Nome do gabinete aqui"
                            disabled={isFormSubmittingOrIsPending}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="cabinetSlug">Slug do cabinete</FieldLabel>
                        <InputForm
                            type="text"
                            name="cabinetSlug"
                            control={control}
                            autoComplete="off"
                            placeholder="Seu slug aqui"
                            disabled={isFormSubmittingOrIsPending}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="ownerName">Seu nome</FieldLabel>
                        <InputForm
                            type="text"
                            name="ownerName"
                            control={control}
                            autoComplete="name"
                            placeholder="Seu nome aqui"
                            disabled={isFormSubmittingOrIsPending}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="ownerEmail">Seu email</FieldLabel>
                        <InputForm
                            type="email"
                            name="ownerEmail"
                            control={control}
                            autoComplete="email"
                            placeholder="Seu email aqui"
                            disabled={isFormSubmittingOrIsPending}
                        />
                    </Field>

                    <Field>
                        <div className="flex items-center">
                            <FieldLabel htmlFor="ownerPassword">Sua senha</FieldLabel>
                        </div>
                        <InputForm
                            control={control}
                            name="ownerPassword"
                            id="password"
                            type="password"
                            placeholder="Sua senha aqui"
                            autoComplete="new-password"
                            disabled={isFormSubmittingOrIsPending}
                        />
                    </Field>

                    <Button type="submit" size="lg" disabled={isFormSubmittingOrIsPending}>
                        Cadastrar
                        {isFormSubmittingOrIsPending && (
                            <Loading />
                        )}
                    </Button>
                    <Field>
                        <div className="flex gap-1 items-center justify-center">
                            <p>
                                Já tem uma conta?
                            </p>
                            <Link className="text-center text-primary hover:underline transition-all duration-200" to="/signIn">
                                Entrar
                            </Link>
                        </div>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
}