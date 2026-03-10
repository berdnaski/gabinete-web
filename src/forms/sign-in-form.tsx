import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { z } from "zod"
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputForm } from "@/components/ui/form/input-form";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/loading";
import { useAuth } from "@/hooks/use-auth";

const signInFormSchema = z.object({
    email: z.email("Digite um e-mail válido."),
    password: z.string().min(6, "Insira uma senha com no mínimo 6 caracteres."),
})

type SignInFormData = z.infer<typeof signInFormSchema>

export function SignInForm() {
    const { signIn, isLoading } = useAuth();

    const form = useForm<SignInFormData>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const {
        control,
        handleSubmit,
    } = form;

    const onSubmit = handleSubmit(async (data: SignInFormData) => {
        try {
            await signIn(data);
            toast.success("Login realizado com sucesso!");
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch {
            toast.error("Erro ao realizar login. Tente novamente");
        }
    })

    return (
        <div className="flex flex-col gap-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight text-zinc-950 leading-[1.1]">
                    Bem-vindo ao seu <br />
                    <span className="text-[#008EFF]">Gabinete Digital</span>
                </h1>
                <p className="text-zinc-500 text-lg leading-relaxed mt-1">
                    Insira seus dados para gerenciar suas conquistas.
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <FieldGroup className="">
                    <Field>
                        <FieldLabel className="text-zinc-600 font-medium mb-1.5 block">Seu e-mail</FieldLabel>
                        <InputForm
                            type="email"
                            name="email"
                            control={control}
                            icon={Mail}
                            autoComplete="email"
                            placeholder="nome@exemplo.com"
                            disabled={isLoading}
                        />
                    </Field>

                    <Field>
                        <div className="flex items-center justify-between">
                            <FieldLabel className="text-zinc-600 font-medium mb-1.5 block">Sua senha</FieldLabel>
                            <Link to="#" className="text-sm font-semibold text-[#008EFF] hover:underline">
                                Esqueceu a senha?
                            </Link>
                        </div>
                        <InputForm
                            control={control}
                            name="password"
                            id="password"
                            type="password"
                            icon={Lock}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                    </Field>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isLoading}
                            className="w-full h-14 bg-[#008EFF] hover:bg-[#007cdb] text-white rounded-xl text-lg font-semibold transition-all active:scale-[0.98] cursor-pointer"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loading />
                                    <span>Entrando...</span>
                                </div>
                            ) : (
                                "Acessar minha conta"
                            )}
                        </Button>
                    </div>

                    <p className="text-center text-zinc-500 text-sm mt-6">
                        Ainda não tem uma conta?{" "}
                        <Link to="/signUp" className="text-[#008EFF] font-bold hover:underline">
                            Cadastrar agora
                        </Link>
                    </p>
                </FieldGroup>
            </form>
        </div>
    )
}
