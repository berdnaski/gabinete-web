import { useRegister } from '@/api/auth/hooks'
import { InputForm } from '@/components/form/input-form'
import { Loading } from '@/components/loading'
import { Button } from '@/components/ui/button'
import {
	Field,
	FieldGroup,
	FieldLabel
} from '@/components/ui/field'
import { registerFormSchema, type RegisterFormData } from '@/validation-schemas/register'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export function SignUpForm() {
	const navigate = useNavigate();

	const {
		mutateAsync: registerUser,
		isPending: isPendingRegisterCabinet,
	} = useRegister();

	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = form;

	const isFormSubmittingOrIsPending = isPendingRegisterCabinet || isSubmitting;

	const onSubmit = handleSubmit(async (data: RegisterFormData) => {
		try {
			await registerUser(data);
			toast.success(
				"Cadastro realizado com sucesso! Você já pode fazer login.",
			);
			await new Promise((resolve) => setTimeout(resolve, 2000));
			navigate("/login");
		} catch {
			toast.error("Erro ao realizar cadastro. Tente novamente");
		}
	});

	return (
		<form onSubmit={onSubmit}>
			<FieldGroup>
				<Field>
					<FieldLabel className="text-zinc-600 font-medium">
						Seu nome completo
					</FieldLabel>
					<InputForm
						type="text"
						name="name"
						control={control}
						autoComplete='name'
						placeholder="Digite seu nome"
						disabled={isFormSubmittingOrIsPending}
					/>
				</Field>

				<Field>
					<FieldLabel className="text-zinc-600 font-medium">
						Seu melhor e-mail
					</FieldLabel>
					<InputForm
						type="email"
						name="email"
						control={control}
						autoComplete='email'
						placeholder="nome@exemplo.com"
						disabled={isFormSubmittingOrIsPending}
					/>
				</Field>

				<Field>
					<FieldLabel className="text-zinc-600 font-medium">
						Sua senha de acesso
					</FieldLabel>
					<InputForm
						control={control}
						id="password"
						name="password"
						type="password"
						autoComplete="new-password"
						placeholder="Crie uma senha forte"
						disabled={isFormSubmittingOrIsPending}
					/>
				</Field>

				<Button
					type="submit"
					disabled={isFormSubmittingOrIsPending}
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

				<div className="relative my-2 flex items-center">
					<div className="flex-grow border-t border-muted border-dashed" />
					<span className="mx-2 text-xs text-muted-foreground uppercase">Ou</span>
					<div className="flex-grow border-t border-muted border-dashed" />
				</div>
				<Button
					type="button"
					variant="outline"
					className="w-full relative flex items-center justify-center font-normal shadow-sm h-10 bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
					onClick={() => {
						window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
					}}
				>
					<svg className="w-5 h-5 absolute left-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
						<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
						<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
						<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
					</svg>
					Continuar com o Google
				</Button>

				<p className="text-center text-zinc-500 text-sm mt-2">
					Já possui uma conta?{" "}
					<Link
						to="/login"
						className="text-primary font-bold hover:underline"
					>
						Fazer login
					</Link>
				</p>
			</FieldGroup>
		</form >
	)
}
