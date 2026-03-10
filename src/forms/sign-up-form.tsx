import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"
import { Building2, Hash, Mail, User, Lock } from "lucide-react";
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
        <div className="flex flex-col gap-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight text-zinc-950 leading-[1.1]">
                    O seu bairro na <br />
                    <span className="text-[#008EFF]">palma da mão</span>
                </h1>
                <p className="text-zinc-500 text-lg leading-relaxed mt-1">
                    Crie sua conta em poucos segundos e conecte sua voz à cidade.
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <FieldGroup className="">
                    <Field>
                        <FieldLabel className="text-zinc-600 font-medium mb-1.5 block">Nome do gabinete</FieldLabel>
                        <InputForm
                            type="text"
                            name="cabinetName"
                            control={control}
                            icon={Building2}
                            placeholder="Ex: Gabinete do Povo"
                            disabled={isFormSubmittingOrIsPending}
                        />
                    </Field>

                    <Field>
                        <FieldLabel className="text-zinc-600 font-medium mb-1.5 block">Slug do gabinete</FieldLabel>
                        <InputForm
                            type="text"
                            name="cabinetSlug"
                            control={control}
                            icon={Hash}
                            placeholder="ex: gabinete-povo"
                            disabled={isFormSubmittingOrIsPending}
                        />
                    </Field>

                    <Field>
                        <FieldLabel className="text-zinc-600 font-medium mb-1.5 block">Seu nome completo</FieldLabel>
                        <InputForm
                            type="text"
                            name="ownerName"
                            control={control}
                            icon={User}
                            placeholder="Digite seu nome"
                            disabled={isFormSubmittingOrIsPending}
                        />
                    </Field>

                    <Field>
                        <FieldLabel className="text-zinc-600 font-medium mb-1.5 block">Seu melhor e-mail</FieldLabel>
                        <InputForm
                            type="email"
                            name="ownerEmail"
                            control={control}
                            icon={Mail}
                            placeholder="nome@exemplo.com"
                            disabled={isFormSubmittingOrIsPending}
                        />
                    </Field>

                    <Field>
                        <FieldLabel className="text-zinc-600 font-medium mb-1.5 block">Sua senha de acesso</FieldLabel>
                        <InputForm
                            control={control}
                            name="ownerPassword"
                            id="password"
                            type="password"
                            icon={Lock}
                            placeholder="Crie uma senha forte"
                            autoComplete="new-password"
                            disabled={isFormSubmittingOrIsPending}
                        />
                    </Field>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isFormSubmittingOrIsPending}
                            className="w-full h-14 bg-[#008EFF] hover:bg-[#007cdb] text-white rounded-xl text-lg font-semibold transition-all active:scale-[0.98] cursor-pointer"
                        >
                            {isFormSubmittingOrIsPending ? (
                                <div className="flex items-center gap-2">
                                    <Loading />
                                    <span>Criando conta...</span>
                                </div>
                            ) : (
                                "Criar minha conta"
                            )}
                        </Button>
                    </div>

                    <p className="text-center text-zinc-500 text-sm mt-6">
                        Já possui uma conta?{" "}
                        <Link to="/signIn" className="text-[#008EFF] font-bold hover:underline">
                            Fazer login
                        </Link>
                    </p>
                </FieldGroup>
            </form>
        </div>
    )
}
