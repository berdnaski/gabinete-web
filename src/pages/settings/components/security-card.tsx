import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useChangePassword } from "@/api/auth/hooks"
import { useAuth } from "@/hooks/use-auth"
import { changePasswordSchema, type ChangePasswordData } from "./schemas"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { InputForm } from "@/components/form/input-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SecurityCard() {
  const { user } = useAuth()
  const { mutateAsync: changePassword, isPending } = useChangePassword()

  const hasSetPassword = user?.hasSetPassword ?? true

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  })

  const onSubmit = handleSubmit(async (data: ChangePasswordData) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success("Solicitação enviada! Verifique seu e-mail para confirmar a alteração.")
      reset()
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Erro ao solicitar alteração de senha."
      toast.error(errorMessage)
    }
  })

  const isSubmittingForm = isPending || isSubmitting

  return (
    <form onSubmit={onSubmit}>
      <Input type="text" name="username" autoComplete="username" value={user?.email ?? ""} readOnly hidden />
      <Card className="bg-card rounded-xl border border-border shadow-sm animate-in fade-in duration-300">
        <CardHeader className="px-6 pt-5 pb-4 border-b border-border">
          <CardTitle className="text-base font-semibold text-foreground">Segurança</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {hasSetPassword
              ? "Altere sua senha para manter sua conta protegida."
              : "Você ainda não possui uma senha — crie uma para acessar pelo e-mail."}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-5">
          <FieldGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              {hasSetPassword && (
                <Field>
                  <Label htmlFor="currentPassword">Senha atual</Label>
                  <InputForm
                    type="password"
                    control={control}
                    name="currentPassword"
                    id="currentPassword"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isSubmittingForm}
                  />
                </Field>
              )}

              <Field>
                <Label htmlFor="newPassword">
                  {hasSetPassword ? "Nova senha" : "Criar senha"}
                </Label>
                <InputForm
                  type="password"
                  control={control}
                  name="newPassword"
                  id="newPassword"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isSubmittingForm}
                />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>

        <CardFooter className="px-6 py-4 border-t border-border flex justify-end">
          <Button type="submit" disabled={isSubmittingForm} size="sm">
            {isSubmittingForm && <Loader2 className="size-3.5 animate-spin" />}
            {hasSetPassword ? "Trocar senha" : "Criar senha"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
