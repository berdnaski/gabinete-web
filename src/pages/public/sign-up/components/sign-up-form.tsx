import { useRegister } from '@/api/auth/hooks'
import { Loading } from '@/components/loading'
import { Button } from '@/components/ui/button'
import {
	Field,
	FieldGroup,
	FieldLabel
} from '@/components/ui/field'
import { InputForm } from '@/components/ui/form/input-form'
import { registerFormSchema, type RegisterFormData } from '@/schemas/register-form'
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
						placeholder="Crie uma senha forte"
						autoComplete="new-password"
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

				<p className="text-center text-zinc-500 text-sm">
					Já possui uma conta?{" "}
					<Link
						to="/login"
						className="text-[#008EFF] font-bold hover:underline"
					>
						Fazer login
					</Link>
				</p>
			</FieldGroup>
		</form >
	)
}
