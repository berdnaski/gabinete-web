import { Button } from '@/components/ui/button'
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field'
import { InputForm } from '@/components/ui/form/input-form'
import { useAuth } from '@/hooks/use-auth'
import { getApiErrorMessage } from '@/lib/utils'
import { loginFormSchema, type LoginFormData } from '@/schemas/login-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export function LoginForm() {

	const { login } = useAuth()

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const { handleSubmit, control } = form

	const onSubmit = handleSubmit(async (data: LoginFormData) => {
		try {
			await login(data);
		} catch (error) {
			toast.error(getApiErrorMessage(error) || "Erro ao realizar login. Verifique suas credenciais e tente novamente.");
		}
	});

	return (
		<form onSubmit={onSubmit}>
			<FieldGroup>
				<div className="flex flex-col gap-1">
					<h1 className="text-2xl font-bold">Gestão inteligente da sua cidade</h1>
					<p className="text-sm text-balance text-muted-foreground">
						Crie sua conta ou faça login
					</p>
				</div>
				<Field>
					<FieldLabel htmlFor="email">Email</FieldLabel>
					<InputForm
						control={control}
						name="email"
						id="email"
						type="email"
						placeholder="m@example.com"
						required
					/>
				</Field>
				<Field>
					<div className="flex items-center">
						<FieldLabel htmlFor="password">Senha</FieldLabel>
						<Link
							to="/forgot-password"
							className="ml-auto hover:text-primary text-muted-foreground transition-all duration-200 text-sm text-balance underline-offset-4 hover:underline"
						>
							Esqueceu sua senha?
						</Link>
					</div>
					<InputForm
						required
						id="password"
						name="password"
						type="password"
						control={control}
					/>
				</Field>
				<Field>
					<Button type="submit">Login</Button>
				</Field>
			</FieldGroup>
			<FieldGroup className="mt-4">
				<Field>
					<FieldDescription className="text-center">
						Ainda não tem uma conta? <Link to="/sign-up">Cadastre-se</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form >
	)
}
