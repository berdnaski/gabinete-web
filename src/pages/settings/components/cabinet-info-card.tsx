import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGetCabinets, useUpdateCabinet } from "@/api/cabinets/hooks";
import { SettingsCard, SettingsCardHeader, SettingsCardFooter, Field } from "./settings-ui";
import { cabinetInfoSchema, type CabinetInfoData } from "./schemas";

export function CabinetInfoCard() {
  const { data: cabinets, isLoading } = useGetCabinets();
  const { mutateAsync: updateCabinet, isPending } = useUpdateCabinet();

  const cabinet = cabinets?.[0];

  const { register, handleSubmit, formState: { errors } } = useForm<CabinetInfoData>({
    resolver: zodResolver(cabinetInfoSchema),
    values: {
      name: cabinet?.name ?? "",
      description: cabinet?.description ?? "",
      email: cabinet?.email ?? "",
    },
  });

  const onSubmit: SubmitHandler<CabinetInfoData> = async (data) => {
    if (!cabinet) return;

    try {
      await updateCabinet({
        slug: cabinet.slug,
        data: {
          name: data.name,
          description: data.description,
          email: data.email
        },
      });
      toast.success("Informações do Gabinete atualizadas!");
    } catch {
      toast.error("Erro ao atualizar informações do Gabinete.");
    }
  };

  if (isLoading) {
    return (
      <SettingsCard className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin opacity-20" />
      </SettingsCard>
    );
  }

  if (!cabinet) {
    return (
      <SettingsCard className="flex items-center justify-center py-12 text-muted-foreground bg-muted/5 border-dashed">
        <p className="text-sm font-medium italic">Nenhum gabinete vinculado encontrado.</p>
      </SettingsCard>
    );
  }

  return (
    <SettingsCard>
      <form id="cabinet-info-form" onSubmit={handleSubmit(onSubmit)}>
        <SettingsCardHeader
          title="Informações do Gabinete"
          description="Esses dados são públicos e aparecem no perfil externo do seu gabinete."
          badge="Público"
        />

        <div className="px-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <Field label="Nome do Gabinete Público" error={errors.name?.message}>
              <Input
                {...register("name")}
                placeholder="Ex: Gabinete Dep. Carlos Mendes"
                className="bg-muted/40 border-none rounded-xl px-4 h-12 text-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
              />
            </Field>

            <Field label="E-mail de Contato Oficial" error={errors.email?.message}>
              <Input 
                {...register("email")}
                placeholder="contato@exemplo.com" 
                className="bg-muted/40 border-none rounded-xl px-4 h-12 text-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium" 
              />
            </Field>

            <Field label="Cargo Político">
              <div className="flex h-12 w-full items-center rounded-xl bg-muted/20 px-4 text-sm opacity-60 cursor-not-allowed font-medium text-foreground/70 italic">
                Informação vinculada ao mandato
              </div>
            </Field>

            <Field label="Link Público do Gabinete">
              <div className="flex bg-muted/40 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-transparent">
                <div className="bg-slate-100/50 dark:bg-slate-800/50 px-4 h-12 flex items-center text-2xs font-bold text-muted-foreground uppercase tracking-wider border-r border-border/20">
                  <Globe className="w-3.5 h-3.5 mr-2 opacity-50" />
                  plataforma.gov/
                </div>
                <div className="flex-1 flex items-center px-4 h-12 text-sm text-foreground font-medium opacity-60">
                  {cabinet.slug}
                </div>
              </div>
            </Field>

            <Field label="Mensagem Pública (Bio)" className="md:col-span-2" error={errors.description?.message}>
              <textarea
                {...register("description")}
                placeholder="Uma breve descrição do seu mandato e objetivos..."
                className="w-full min-h-30 p-4 text-sm rounded-xl bg-muted/40 border-none outline-none focus-visible:ring-2 focus-visible:ring-primary/20 resize-none font-medium leading-relaxed transition-all"
              />
            </Field>
          </div>
        </div>

        <SettingsCardFooter formId="cabinet-info-form" isLoading={isPending} />
      </form>
    </SettingsCard>
  );
}

