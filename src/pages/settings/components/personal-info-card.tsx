import { useRef, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Camera, Loader2, Trash2, User, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { useUpdateUser } from "@/api/users/hooks"
import { personalInfoSchema, type PersonalInfoData } from "./schemas"
import { InputForm } from "@/components/form/input-form"
import { UserRole, UserRoleLabel } from "@/api/users/types"
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

export function PersonalInfoCard() {
  const { user, updateLocalUser } = useAuth()
  const { mutateAsync: updateUser, isPending } = useUpdateUser()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
    },
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setRemoveAvatar(false)
    }
    e.target.value = ""
  }

  const handleRemoveAvatar = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(null)
    setPreviewUrl(null)
    setRemoveAvatar(true)
  }

  const handleCancelRemove = () => {
    setRemoveAvatar(false)
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const onSubmit = handleSubmit(async (data: PersonalInfoData) => {
    if (!user) return
    try {
      const updatedUser = await updateUser({
        id: user.id,
        data: { name: data.name, phone: data.phone, removeAvatar },
        file: selectedFile || undefined,
      })
      updateLocalUser({
        name: updatedUser.name,
        avatarUrl: updatedUser.avatarUrl,
        phone: updatedUser.phone,
      })
      toast.success("Informações pessoais atualizadas!")
      setSelectedFile(null)
      setRemoveAvatar(false)
    } catch {
      toast.error("Erro ao atualizar informações pessoais.")
    }
  })

  const isSubmittingForm = isPending || isSubmitting
  const currentAvatar = removeAvatar ? undefined : (previewUrl || user?.avatarUrl)
  const hasAvatar = currentAvatar ? true : false

  return (
    <form onSubmit={onSubmit}>
      <Card className="border border-border rounded-xl bg-card shadow-sm animate-in fade-in duration-300">
        <CardHeader className="px-6 pt-5 pb-4 border-b border-border">
          <CardTitle className="text-base font-semibold text-foreground">
            Informações Pessoais
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Gerencie seu nome, foto e telefone de contato.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-5">
          <FieldGroup>
            <div className="flex flex-col gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div className="relative group">
                    <Avatar className="size-20 ring-2 ring-border">
                      <AvatarImage
                        src={currentAvatar}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        <User className="size-8" />
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="size-5 text-white" />
                    </button>
                  </div>

                  <Input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/png, image/jpeg, image/jpg"
                  />

                  {/* Actions */}
                  <div className="flex flex-col items-center gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 inline-flex items-center justify-center gap-1.5 px-3 rounded-lg bg-muted text-xs font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors duration-200"
                    >
                      <Camera className="size-3.5" />
                      Alterar foto
                    </button>

                    {hasAvatar && !removeAvatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="h-8 inline-flex items-center justify-center gap-1.5 px-3 rounded-lg bg-destructive/10 text-xs font-medium text-destructive hover:bg-destructive/20 hover:text-red-600 transition-colors duration-200"
                      >
                        <Trash2 className="size-3.5" />
                        Remover foto
                      </button>
                    )}

                    {removeAvatar && (
                      <div className="flex gap-2 w-full px-1">
                        <button
                          type="button"
                          onClick={handleCancelRemove}
                          className="flex-1 h-8 inline-flex items-center justify-center gap-1 rounded-lg bg-secondary text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200"
                        >
                          <X className="size-3.5" />
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fields */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <Label htmlFor="name">Nome completo</Label>
                    <InputForm
                      name="name"
                      control={control}
                      id="name"
                      placeholder="Seu nome"
                      disabled={isSubmittingForm}
                    />
                  </Field>

                  <Field>
                    <Label>E-mail</Label>
                    <Input
                      disabled
                      defaultValue={user?.email ?? ""}
                      className="opacity-50 cursor-not-allowed"
                    />
                  </Field>

                  <Field>
                    <Label>Cargo</Label>
                    <Input
                      disabled
                      defaultValue={UserRoleLabel[user?.role as UserRole] ?? ""}
                      className="opacity-50 cursor-not-allowed"
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="phone">Telefone</Label>
                    <InputForm
                      name="phone"
                      control={control}
                      id="phone"
                      placeholder="Seu telefone"
                      disabled={isSubmittingForm}
                    />
                  </Field>
                </div>
              </div>
            </div>
          </FieldGroup>
        </CardContent>

        <CardFooter className="px-6 py-4 border-t border-border flex justify-end">
          <Button type="submit" disabled={isSubmittingForm} size="sm">
            {isSubmittingForm && <Loader2 className="size-3.5 animate-spin" />}
            Salvar
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
