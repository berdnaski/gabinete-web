import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateUser } from "@/api/users/hooks";
import { personalInfoSchema, type PersonalInfoData } from "./schemas";
import { InputForm } from "@/components/form/input-form";
import { UserRole, UserRoleLabel } from "@/api/users/types";
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/loading";

export function PersonalInfoCard() {
  const { user, updateLocalUser } = useAuth();
  const { mutateAsync: updateUser, isPending: isPendingUpdateUser } = useUpdateUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<PersonalInfoData>({
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

  const onSubmit = handleSubmit(async (data: PersonalInfoData) => {
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
  })

  const isSubmittingForm = isPendingUpdateUser || isSubmitting;

  return (
    <form onSubmit={onSubmit}>
      <Card className="bg-card rounded-lg shadow-lg border border-border/30 animate-in fade-in duration-500">
        <CardHeader className="px-6 py-2">
          <CardTitle className="text-xl font-bold text-foreground tracking-tight">Informações Pessoais</CardTitle>
          <CardDescription>
            Gerencie seus dados de acesso e perfil profissional.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-2">
          <FieldGroup>
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
                <Input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/png, image/jpeg, image/jpg"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                >
                  Mudar Foto
                </Button>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <Field>
                  <Label htmlFor="name">Nome Completo</Label>
                  <InputForm
                    name="name"
                    control={control}
                    placeholder="Seu nome"
                    disabled={isSubmittingForm}
                    className="bg-muted/40 border-none rounded-xl px-4 h-12 text-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                  />
                </Field>

                <Field>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    disabled
                    name="email"
                    defaultValue={user?.email ?? ""}
                    className="bg-muted/20 border-none rounded-xl px-4 h-12 text-sm opacity-60 cursor-not-allowed font-medium"
                  />
                </Field>

                <Field>
                  <Label>Cargo</Label>
                  <Input
                    disabled
                    defaultValue={UserRoleLabel[user?.role as UserRole] ?? ""}
                    className="bg-muted/20 border-none rounded-xl px-4 h-12 text-sm opacity-60 cursor-not-allowed font-medium"
                  />
                </Field>

                <Field>
                  <Label htmlFor="phone">Telefone</Label>
                  <InputForm
                    name="phone"
                    control={control}
                    placeholder="Seu telefone"
                    disabled={isSubmittingForm}
                    className="bg-muted/40 border-none rounded-xl px-4 h-12 text-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                  />
                </Field>
              </div>
            </div>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isSubmittingForm}
            className="ml-auto px-8 h-12 rounded-xl font-bold text-sm shadow-lg shadow-primary/10 hover:-translate-y-0.5 transition-all">
            Salvar Dados
            {isSubmittingForm && (
              <Loading />
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
