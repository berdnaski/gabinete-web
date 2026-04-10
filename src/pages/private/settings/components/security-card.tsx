import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useChangePassword } from "@/api/auth/hooks";
import { useAuth } from "@/hooks/use-auth";
import { SettingsCard, SettingsCardHeader, SettingsCardFooter, Field } from "./settings-ui";
import { changePasswordSchema, type ChangePasswordData } from "./schemas";

export function SecurityCard() {
  const { user } = useAuth();
  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const hasSetPassword = user?.hasSetPassword ?? true;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit: SubmitHandler<ChangePasswordData> = async (data) => {
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
  };

  return (
    <SettingsCard>
      <form id="security-form" onSubmit={handleSubmit(onSubmit)}>
        <SettingsCardHeader
          title="Segurança"
          description={hasSetPassword 
            ? "Proteja sua conta alterando sua senha regularmente."
            : "Você ainda não possui uma senha definida."
          }
        />
        
        <div className="px-8 pb-4">
          <div className="max-w-2xl space-y-6">
            {hasSetPassword && (
              <Field label="Senha Atual" error={errors.currentPassword?.message}>
                <Input 
                  {...register("currentPassword")}
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-muted/40 border-none rounded-xl px-4 h-12 text-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium" 
                />
              </Field>
            )}

            <Field label={hasSetPassword ? "Nova Senha" : "Criar Senha"} error={errors.newPassword?.message}>
              <Input 
                {...register("newPassword")}
                type="password" 
                placeholder="••••••••" 
                className="bg-muted/40 border-none rounded-xl px-4 h-12 text-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium" 
              />
            </Field>
          </div>
        </div>

        <SettingsCardFooter 
          formId="security-form" 
          label={hasSetPassword ? "Trocar Senha" : "Criar Senha"} 
          isLoading={isPending} 
        />
      </form>
    </SettingsCard>
  );
}

