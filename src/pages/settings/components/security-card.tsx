import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useChangePassword } from "@/api/auth/hooks";
import { useAuth } from "@/hooks/use-auth";
import { changePasswordSchema, type ChangePasswordData } from "./schemas";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { InputForm } from "@/components/form/input-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/loading";
import { Input } from "@/components/ui/input";

export function SecurityCard() {
  const { user } = useAuth();
  const { mutateAsync: changePassword, isPending: isPendingChangePassword } = useChangePassword();

  const hasSetPassword = user?.hasSetPassword ?? true;

  const form = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting }
  } = form

  const onSubmit = handleSubmit(async (data: ChangePasswordData) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });

      toast.success("Solicitação enviada! Verifique seu e-mail para confirmar a alteração.");
      reset();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao solicitar alteração de senha.";
      toast.error(errorMessage);
    }
  })

  const isFormSubmitting = isPendingChangePassword || isSubmitting;

  return (
    <form onSubmit={onSubmit}>
      <Input type="text" name="username" autoComplete="username" value={user?.email ?? ""} readOnly hidden />
      <Card className="bg-card rounded-lg shadow-lg border border-border/30 animate-in fade-in duration-500">
        <CardHeader className="px-6 py-2">
          <CardTitle className="text-xl font-bold text-foreground tracking-tight">Segurança</CardTitle>
          <CardDescription>
            {hasSetPassword
              ? "Proteja sua conta alterando sua senha regularmente."
              : "Você ainda não possui uma senha definida."}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-2">
          <FieldGroup>
            {hasSetPassword && (
              <Field>
                <Label htmlFor="currentPassword">Senha atual</Label>
                <InputForm
                  type="password"
                  control={control}
                  placeholder="••••••••"
                  name="currentPassword"
                  disabled={isFormSubmitting}
                  className="bg-muted/40 border-none rounded-xl px-4 h-12 text-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                />
              </Field>
            )}

            <Field>
              <Label htmlFor="newPassword">{hasSetPassword ? "Nova Senha" : "Criar Senha"}</Label>
              <InputForm
                type="password"
                control={control}
                name="newPassword"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isFormSubmitting}
                className="bg-muted/40 border-none rounded-xl px-4 h-12 text-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
              />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isFormSubmitting}
            className="ml-auto px-8 h-12 rounded-xl font-bold text-sm shadow-lg shadow-primary/10 hover:-translate-y-0.5 transition-all">
            {hasSetPassword ? "Trocar Senha" : "Criar Senha"}
            {isFormSubmitting && (
              <Loading />
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

