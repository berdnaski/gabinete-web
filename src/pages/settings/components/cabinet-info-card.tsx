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
      <Card className="bg-card rounded-xl border border-border shadow-sm">
        <CardContent className="flex items-center justify-center py-20">
          <Loader2 className="size-5 text-muted-foreground/30 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!cabinet) {
    return (
      <Card className="bg-card rounded-xl border border-dashed border-border shadow-sm">
        <CardContent className="flex items-center justify-center py-16">
          <p className="text-sm text-muted-foreground italic">Nenhum gabinete vinculado encontrado.</p>
        </CardContent>
      </Card>
    )
  }

  const publicHost = typeof window !== "undefined" ? window.location.host : "gabineteapp.com.br"

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="bg-card rounded-xl border border-border shadow-sm animate-in fade-in duration-300">
        <CardHeader className="px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Informações do Gabinete
            </CardTitle>
            <span className="bg-primary/10 text-primary text-2xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              Público
            </span>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Esses dados aparecem no perfil público do seu gabinete.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-5">
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <Label htmlFor="name">Nome do Gabinete</Label>
                <InputForm
                  name="name"
                  control={control}
                  id="name"
                  placeholder="Ex: Gabinete Dep. Carlos Mendes"
                  disabled={disabled}
                  className={cn(disabled && "opacity-50 cursor-not-allowed")}
                />
              </Field>

              <Field>
                <Label htmlFor="email">E-mail de Contato</Label>
                <InputForm
                  name="email"
                  control={control}
                  id="email"
                  placeholder="contato@exemplo.com"
                  disabled={disabled}
                  className={cn(disabled && "opacity-50 cursor-not-allowed")}
                />
              </Field>

              <Field>
                <Label>Cargo Político</Label>
                <Input
                  disabled
                  defaultValue="Informação vinculada ao mandato"
                  className="opacity-50 cursor-not-allowed italic"
                />
              </Field>

              <Field>
                <Label>Link Público</Label>
                <a
                  href={`/${cabinet.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 rounded-md border border-border bg-background overflow-hidden hover:border-primary/40 transition-colors group"
                >
                  <span className="flex items-center gap-1.5 px-3 h-full text-2xs font-medium text-muted-foreground bg-muted border-r border-border shrink-0">
                    <Globe className="size-3 shrink-0 opacity-60" />
                    {publicHost}/
                  </span>
                  <span className="flex items-center px-3 h-full text-sm text-primary truncate group-hover:underline">
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
                  rows={3}
                  className={cn(
                    "resize-none text-sm",
                    disabled && "opacity-50 cursor-not-allowed",
                    errors.description && "border-destructive/60",
                  )}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description.message}</p>
                )}
              </Field>
            </div>
          </FieldGroup>
        </CardContent>

        <CardFooter className="px-6 py-4 border-t border-border flex items-center justify-between">
          {isOwner ? (
            <Button type="submit" disabled={isSubmittingForm} size="sm" className="ml-auto">
              {isSubmittingForm && <Loader2 className="size-3.5 animate-spin" />}
              Salvar
            </Button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3.5 shrink-0" />
              <span>Apenas o responsável pelo gabinete pode editar estas informações.</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </form>
  )
}
