import { useRef, useState, useEffect, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateUser } from "@/api/users/hooks";
import { SettingsCard, SettingsCardHeader, SettingsCardFooter, Field } from "./settings-ui";
import { personalInfoSchema, type PersonalInfoData } from "./schemas";

export function PersonalInfoCard() {
  const { user, updateLocalUser } = useAuth();
  const { mutateAsync: updateUser, isPending } = useUpdateUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
    },
  });


  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onSubmit: SubmitHandler<PersonalInfoData> = async (data) => {
    if (!user) return;

    try {
      const updatedUser = await updateUser({
        id: user.id,
        data: {
          name: data.name,
          phone: data.phone
        },
        file: selectedFile || undefined,
      });

      updateLocalUser({
        name: updatedUser.name,
        avatarUrl: updatedUser.avatarUrl,
        phone: updatedUser.phone
      });

      toast.success("Informações pessoais atualizadas com sucesso!");
      setSelectedFile(null);
    } catch {
      toast.error("Erro ao atualizar informações pessoais.");
    }
  };

  return (
    <SettingsCard>
      <form id="personal-info-form" onSubmit={handleSubmit(onSubmit)}>
        <SettingsCardHeader
          title="Informações Pessoais"
          description="Gerencie seus dados de acesso e perfil profissional."
        />

        <div className="px-8 pb-2">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="relative group rounded-full">
                <Avatar className="w-32 h-32 rounded-full ring-4 ring-background shadow-inner transition-transform group-hover:scale-[1.02] duration-300">
                  <AvatarImage src={previewUrl || user?.avatarUrl} className="object-cover" />
                  <AvatarFallback className="rounded-full bg-primary/5 text-primary/40">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition-all duration-300 flex items-center justify-center text-white cursor-pointer backdrop-blur-[2px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-8 h-8 animate-in zoom-in-50 duration-300" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileSelect}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
              >
                Mudar Foto
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <Field label="Nome Completo" error={errors.name?.message}>
                <Input
                  {...register("name")}
                  placeholder="Seu nome"
                  className="bg-muted/40 border-none rounded-xl px-4 h-12 text-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                />
              </Field>

              <Field label="E-mail">
                <Input
                  defaultValue={user?.email ?? ""}
                  disabled
                  className="bg-muted/20 border-none rounded-xl px-4 h-12 text-sm opacity-60 cursor-not-allowed font-medium"
                />
              </Field>

              <Field label="Cargo">
                <Input
                  defaultValue={user?.role ?? ""}
                  disabled
                  className="bg-muted/20 border-none rounded-xl px-4 h-12 text-sm opacity-60 cursor-not-allowed font-medium"
                />
              </Field>

              <Field label="Telefone" error={errors.phone?.message}>
                <Input
                  {...register("phone")}
                  className="bg-muted/40 border-none rounded-xl px-4 h-12 text-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                  placeholder="Seu telefone"
                />
              </Field>
            </div>
          </div>
        </div>

        <SettingsCardFooter
          formId="personal-info-form"
          isLoading={isPending}
        />
      </form>
    </SettingsCard>
  );
}
