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
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Transformando dias em conquistas.</h1>
                <p className="text-muted-foreground text-sm text-balance">Insira seus dados para iniciar sua jornada.</p>
            </div>

            <form onSubmit={onSubmit}>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="email">Seu email</FieldLabel>
                        <InputForm
                            type="email"
                            name="email"
                            control={control}
                            autoComplete="email"
                            placeholder="Seu email aqui"
                            disabled={isLoading}
                        />
                    </Field>

                    <Field>
                        <div className="flex items-center">
                            <FieldLabel htmlFor="password">Sua senha</FieldLabel>
                        </div>
                        <InputForm
                            control={control}
                            name="password"
                            id="password"
                            type="password"
                            placeholder="Sua senha aqui"
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                    </Field>

                    <Button type="submit" size="lg" disabled={isLoading}>
                        Entrar
                        {isLoading && (
                            <Loading />
                        )}
                    </Button>
                    <Field>
                        <div className="flex gap-1 items-center justify-center">
                            <p>
                                Não possui uma conta?
                            </p>
                            <Link className="text-center text-primary hover:underline transition-all duration-200" to="/signUp">
                                Cadastrar
                            </Link>
                        </div>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
}