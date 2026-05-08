import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Globe, Lock, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useGetCabinets, useUpdateCabinet } from "@/api/cabinets/hooks"
import { cabinetInfoSchema, type CabinetInfoData } from "./schemas"
import { InputForm } from "@/components/form/input-form"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCurrentMember } from "@/hooks/use-current-member"
import { cn } from "@/lib/utils"

const INPUT_CLASS =
  "bg-muted/40 border-none rounded-xl px-4 h-12 text-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"

export function CabinetInfoCard() {
  const { data: cabinets, isLoading: isLoadingCabinet } = useGetCabinets()
  const { currentMember, isLoading: isLoadingMember } = useCurrentMember()
  const { mutateAsync: updateCabinet, isPending } = useUpdateCabinet()

  const cabinet = cabinets?.[0]
  const isOwner = currentMember?.role === "OWNER"
  const isLoading = isLoadingCabinet || isLoadingMember

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CabinetInfoData>({
    resolver: zodResolver(cabinetInfoSchema),
    values: {
      name: cabinet?.name ?? "",
      description: cabinet?.description ?? "",
      email: cabinet?.email ?? "",
    },
  })

  const isSubmittingForm = isPending || isSubmitting
  const disabled = !isOwner || isSubmittingForm

  const onSubmit: SubmitHandler<CabinetInfoData> = async (data) => {
    if (!cabinet || !isOwner) return
    try {
      await updateCabinet({
        slug: cabinet.slug,
        data: { name: data.name, description: data.description, email: data.email },
      })
      toast.success("Informações do Gabinete atualizadas!")
    } catch {
      toast.error("Erro ao atualizar informações do Gabinete.")
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-card rounded-lg shadow-lg border border-border/30">
        <CardContent className="flex items-center justify-center py-20">
          <Loader2 className="size-6 text-muted-foreground/30 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!cabinet) {
    return (
      <Card className="bg-card rounded-lg shadow-lg border border-border/30 border-dashed">
        <CardContent className="flex items-center justify-center py-16">
          <p className="text-sm text-muted-foreground italic">Nenhum gabinete vinculado encontrado.</p>
        </CardContent>
      </Card>
    )
  }

  const publicHost = typeof window !== "undefined" ? window.location.host : "gabineteapp.com.br"

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="bg-card rounded-lg shadow-lg border border-border/30 animate-in fade-in duration-500">
        <CardHeader className="px-6 py-5">
          <div className="flex items-center gap-2.5 mb-0.5">
            <CardTitle className="text-xl font-bold text-foreground tracking-tight">
              Informações do Gabinete
            </CardTitle>
            <span className="bg-primary/10 text-primary text-2xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              Público
            </span>
          </div>
          <CardDescription>
            Esses dados são públicos e aparecem no perfil externo do seu gabinete.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-2">
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <Field>
                <Label htmlFor="name">Nome do Gabinete Público</Label>
                <InputForm
                  name="name"
                  control={control}
                  id="name"
                  placeholder="Ex: Gabinete Dep. Carlos Mendes"
                  disabled={disabled}
                  className={cn(INPUT_CLASS, disabled && "opacity-60 cursor-not-allowed")}
                />
              </Field>

              <Field>
                <Label htmlFor="email">E-mail de Contato Oficial</Label>
                <InputForm
                  name="email"
                  control={control}
                  id="email"
                  placeholder="contato@exemplo.com"
                  disabled={disabled}
                  className={cn(INPUT_CLASS, disabled && "opacity-60 cursor-not-allowed")}
                />
              </Field>

              <Field>
                <Label>Cargo Político</Label>
                <Input
                  disabled
                  defaultValue="Informação vinculada ao mandato"
                  className={cn(INPUT_CLASS, "opacity-50 cursor-not-allowed italic")}
                />
              </Field>

              <Field>
                <Label>Link Público do Gabinete</Label>
                <a
                  href={`/${cabinet.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 rounded-xl bg-muted/40 overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all group"
                >
                  <span className="flex items-center gap-1.5 px-4 h-full text-2xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/60 border-r border-border/30 shrink-0">
                    <Globe className="size-3.5 opacity-50 shrink-0" />
                    {publicHost}/
                  </span>
                  <span className="flex items-center px-4 h-full text-sm font-medium text-primary truncate group-hover:underline">
                    {cabinet.slug}
                  </span>
                </a>
              </Field>

              <Field className="md:col-span-2">
                <Label htmlFor="description">Mensagem Pública (Bio)</Label>
                <Textarea
                  {...register("description")}
                  id="description"
                  placeholder="Uma breve descrição do seu mandato e objetivos..."
                  disabled={disabled}
                  rows={4}
                  className={cn(
                    "resize-none bg-muted/40 border-none rounded-xl px-4 py-3 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary/20",
                    disabled && "opacity-60 cursor-not-allowed",
                    errors.description && "border border-destructive/40",
                  )}
                />
                {errors.description && (
                  <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
                )}
              </Field>
            </div>
          </FieldGroup>
        </CardContent>

        <CardFooter className="px-6 py-5 mt-4 border-t border-border/30 flex items-center justify-between">
          {isOwner ? (
            <Button
              type="submit"
              disabled={isSubmittingForm}
              className="ml-auto px-8 h-12 rounded-xl font-bold text-sm shadow-lg shadow-primary/10 hover:-translate-y-0.5 transition-all"
            >
              {isSubmittingForm && <Loader2 className="size-4 animate-spin" />}
              Salvar Dados
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="size-3.5 shrink-0 opacity-60" />
              <span>Apenas o responsável pelo gabinete pode editar estas informações.</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </form>
  )
}
