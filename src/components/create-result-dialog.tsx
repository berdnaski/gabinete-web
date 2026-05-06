import { useCreateResult } from "@/api/results/hooks"
import type { ResultType } from "@/api/results/types"
import type { Demand } from "@/api/demands/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { ImageIcon, Loader2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

const RESULT_TYPE_OPTIONS: {
  value: ResultType
  label: string
  className: string
}[] = [
  {
    value: "INFRASTRUCTURE",
    label: "Infraestrutura",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  {
    value: "SOCIAL",
    label: "Social",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    value: "LEGISLATIVE",
    label: "Legislativo",
    className: "border-purple-200 bg-purple-50 text-purple-700",
  },
  {
    value: "OTHER",
    label: "Outro",
    className: "border-zinc-200 bg-zinc-50 text-zinc-600",
  },
]

const MAX_IMAGES = 10
const MAX_FILE_SIZE_MB = 10

interface CreateResultDialogProps {
  demand: Demand
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateResultDialog({
  demand,
  open,
  onOpenChange,
}: CreateResultDialogProps) {
  const { cabinet } = useAuth()
  const { mutate, isPending } = useCreateResult()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [type, setType] = useState<ResultType>("INFRASTRUCTURE")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      setType("INFRASTRUCTURE")
      setTitle("")
      setDescription("")
      setImages([])
      setPreviews([])
    }
  }, [open])

  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [images])

  function handleFiles(files: FileList | null) {
    if (!files) return
    const valid: File[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" não é uma imagem válida.`)
        continue
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`"${file.name}" excede ${MAX_FILE_SIZE_MB}MB.`)
        continue
      }
      valid.push(file)
    }
    setImages((prev) => {
      const next = [...prev, ...valid].slice(0, MAX_IMAGES)
      if (prev.length + valid.length > MAX_IMAGES) {
        toast.error(`Máximo de ${MAX_IMAGES} imagens por resultado.`)
      }
      return next
    })
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cabinet?.slug || !title.trim() || !description.trim()) return

    mutate(
      {
        title: title.trim(),
        description: description.trim(),
        type,
        cabinetSlug: cabinet.slug,
        demandId: demand.id,
        images: images.length > 0 ? images : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Resultado registrado com sucesso")
          onOpenChange(false)
        },
        onError: () => toast.error("Erro ao registrar resultado"),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-border shrink-0">
          <DialogTitle className="text-base">Registrar resultado</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="rounded-lg border border-border bg-muted/40 px-3.5 py-2.5 mb-4">
            <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
              Demanda
            </p>
            <p className="text-sm font-medium text-foreground line-clamp-2">
              {demand.title}
            </p>
          </div>

          <form id="create-result-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
                Tipo
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {RESULT_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setType(opt.value)}
                    className={cn(
                      "flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                      type === opt.value
                        ? cn(opt.className, "ring-1 ring-inset ring-current/20")
                        : "border-border text-muted-foreground hover:text-foreground hover:border-border/80",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
                Título
              </p>
              <Input
                placeholder="Ex: Calçada reparada na Rua XV"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
                Descrição
              </p>
              <Textarea
                placeholder="Descreva o que foi realizado, decisões tomadas ou informações relevantes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                rows={3}
                className="resize-none text-sm"
                required
              />
              {description.length > 800 && (
                <p className="text-xs text-muted-foreground text-right">
                  {description.length}/1000
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Imagens
                </p>
                {images.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {images.length}/{MAX_IMAGES}
                  </span>
                )}
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-1.5">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="size-4 text-white" />
                      </button>
                    </div>
                  ))}
                  {images.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-lg border border-dashed border-border bg-muted/40 flex items-center justify-center hover:bg-muted/60 transition-colors"
                    >
                      <ImageIcon className="size-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              )}

              {images.length === 0 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-6 hover:bg-muted/40 transition-colors"
                >
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                    <ImageIcon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Adicionar imagens</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Arraste ou clique · até {MAX_IMAGES} fotos · max {MAX_FILE_SIZE_MB}MB cada
                    </p>
                  </div>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
          </form>
        </div>

        <div className="px-5 py-4 border-t border-border shrink-0">
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="create-result-form"
              disabled={isPending || !title.trim() || !description.trim()}
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Registrar resultado
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
