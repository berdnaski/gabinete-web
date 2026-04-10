import { InputForm } from '@/components/form/input-form'
import { Button } from '@/components/ui/button'
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field'
import { useAuth } from '@/hooks/use-auth'
import { loginFormSchema, type LoginFormData } from '@/validation-schemas/login'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

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
		await login(data);
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
						required
						id="email"
						type="email"
						name="email"
						autoComplete='email webauthn'
						inputMode='email'
						placeholder="m@example.com"
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
						inputMode='text'
						control={control}
						autoComplete='current-password webauthn'
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
