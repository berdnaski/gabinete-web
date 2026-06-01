import { useRef, useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { QRCodeSVG } from "qrcode.react"
import { Image, ImageIcon, Palette, QrCode, Code2, Copy, Check, Loader2, Lock, Upload, X } from "lucide-react"
import { useGetCabinets, useUpdateCabinet } from "@/api/cabinets/hooks"
import { useCurrentMember } from "@/hooks/use-current-member"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field, FieldGroup } from "@/components/ui/field"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BannerCropDialog } from "@/components/ui/banner-crop-dialog"

const ACCENT_PRESETS = [
  "#0058F3",
  "#7C3AED",
  "#059669",
  "#DC2626",
  "#D97706",
  "#0891B2",
  "#BE185D",
  "#1D4ED8",
]

export function CabinetBrandingCard() {
  const { data: cabinets, isLoading: isLoadingCabinet } = useGetCabinets()
  const { currentMember, isLoading: isLoadingMember } = useCurrentMember()
  const { mutateAsync: updateCabinet, isPending } = useUpdateCabinet()
  const { refreshProfile } = useAuth()

  const cabinet = cabinets?.[0]
  const isOwner = currentMember?.role === "OWNER"
  const isLoading = isLoadingCabinet || isLoadingMember

  const [accentColor, setAccentColor] = useState(cabinet?.accentColor ?? "#0058F3")

  // banner
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [cropSource, setCropSource] = useState<string | null>(null)
  const [cropOpen, setCropOpen] = useState(false)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  // logo
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (cabinet?.accentColor) setAccentColor(cabinet.accentColor)
  }, [cabinet?.accentColor])

  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview)
      if (logoPreview) URL.revokeObjectURL(logoPreview)
    }
  }, [bannerPreview, logoPreview])

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (bannerInputRef.current) bannerInputRef.current.value = ""
    const url = URL.createObjectURL(file)
    setCropSource(url)
    setCropOpen(true)
  }

  const handleCropConfirm = useCallback((file: File, previewUrl: string) => {
    if (bannerPreview) URL.revokeObjectURL(bannerPreview)
    if (cropSource) URL.revokeObjectURL(cropSource)
    setSelectedBanner(file)
    setBannerPreview(previewUrl)
    setCropSource(null)
    setCropOpen(false)
  }, [bannerPreview, cropSource])

  const handleCropCancel = useCallback(() => {
    if (cropSource) URL.revokeObjectURL(cropSource)
    setCropSource(null)
    setCropOpen(false)
  }, [cropSource])

  const removeBannerPreview = () => {
    if (bannerPreview) URL.revokeObjectURL(bannerPreview)
    setSelectedBanner(null)
    setBannerPreview(null)
    if (bannerInputRef.current) bannerInputRef.current.value = ""
  }

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (logoPreview) URL.revokeObjectURL(logoPreview)
    setSelectedLogo(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const removeLogoPreview = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview)
    setSelectedLogo(null)
    setLogoPreview(null)
    if (logoInputRef.current) logoInputRef.current.value = ""
  }

  const handleSave = async () => {
    if (!cabinet || !isOwner) return
    try {
      await updateCabinet({
        slug: cabinet.slug,
        data: { accentColor },
        bannerFile: selectedBanner ?? undefined,
        logoFile: selectedLogo ?? undefined,
      })
      await refreshProfile()
      toast.success("Personalização salva!")
      setSelectedBanner(null)
      setBannerPreview(null)
      setSelectedLogo(null)
      setLogoPreview(null)
    } catch {
      toast.error("Erro ao salvar personalização.")
    }
  }

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${cabinet?.slug}`
    : `https://gabineteapp.com.br/${cabinet?.slug}`

  const widgetCode = cabinet
    ? `<script src="${window.location.origin}/api/cabinets/${cabinet.slug}/widget.js"></script>`
    : ""

  const copyWidget = () => {
    navigator.clipboard.writeText(widgetCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
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

  if (!cabinet) return null

  const isSubmitting = isPending

  return (
    <Card className="bg-card rounded-xl border border-border shadow-sm animate-in fade-in duration-300">
      <CardHeader className="px-6 pt-5 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold text-foreground">
            Identidade Visual
          </CardTitle>
          <span className="bg-muted text-muted-foreground text-2xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
            Exclusivo
          </span>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Personalize a aparência do seu perfil público — logo, cor, banner, QR Code e widget.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 py-5 space-y-8">

        {/* ── Logo ── */}
        <FieldGroup>
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Logo do gabinete</span>
          </div>

          <div className="flex items-start gap-4">
            {/* Preview */}
            <div className="relative size-20 rounded-xl overflow-hidden border border-border bg-muted/30 shrink-0 flex items-center justify-center">
              {logoPreview || cabinet.logoUrl ? (
                <img
                  src={logoPreview ?? cabinet.logoUrl ?? ""}
                  alt="Logo preview"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span className="text-2xs text-muted-foreground text-center leading-tight px-1">
                  Sem logo
                </span>
              )}
              {logoPreview && (
                <button
                  type="button"
                  onClick={removeLogoPreview}
                  className="absolute top-1 right-1 size-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Substitui o logo "Gabinete Digital" no cabeçalho do seu perfil público. Se não configurado, o logo padrão do sistema é exibido.
              </p>
              <p className="text-xs text-muted-foreground">
                Recomendado: formato horizontal, fundo transparente (PNG). Máx. 5 MB.
              </p>
              {isOwner && !isSubmitting && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit gap-1.5 text-xs"
                  onClick={() => logoInputRef.current?.click()}
                >
                  <Upload className="size-3" />
                  {cabinet.logoUrl && !logoPreview ? "Trocar logo" : "Carregar logo"}
                </Button>
              )}
            </div>
          </div>

          <Input
            type="file"
            ref={logoInputRef}
            className="hidden"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleLogoSelect}
          />
        </FieldGroup>

        {/* ── Accent color ── */}
        <FieldGroup>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Cor de destaque</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {ACCENT_PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                disabled={!isOwner || isSubmitting}
                onClick={() => setAccentColor(color)}
                className={cn(
                  "size-8 rounded-full border-2 transition-all duration-150 shrink-0",
                  accentColor === color
                    ? "border-foreground scale-110 shadow-md"
                    : "border-transparent hover:border-muted-foreground/40",
                  (!isOwner || isSubmitting) && "opacity-40 cursor-not-allowed",
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            <div className="flex items-center gap-2 ml-1">
              <div
                className="size-8 rounded-full border-2 border-foreground/20 shrink-0"
                style={{ backgroundColor: accentColor }}
              />
              <Input
                type="color"
                value={accentColor}
                disabled={!isOwner || isSubmitting}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-10 h-8 p-0.5 rounded-md border border-border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Cor personalizada"
              />
              <span className="text-xs font-mono text-muted-foreground">{accentColor}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Aparece na barra de resolutividade, no banner e nos botões do perfil público.
          </p>
        </FieldGroup>

        {/* ── Banner ── */}
        <FieldGroup>
          <div className="flex items-center gap-2 mb-3">
            <Image className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Banner do perfil</span>
          </div>

          <div className="relative w-full h-28 rounded-xl overflow-hidden border border-border bg-muted/30">
            {bannerPreview || cabinet.bannerUrl ? (
              <img
                src={bannerPreview ?? cabinet.bannerUrl ?? ""}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}cc 0%, ${accentColor} 100%)`,
                }}
              >
                <span className="text-xs text-white/70 font-medium">Banner padrão (gradiente)</span>
              </div>
            )}

            {bannerPreview && (
              <button
                type="button"
                onClick={removeBannerPreview}
                className="absolute top-2 right-2 size-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="size-3.5" />
              </button>
            )}

            {isOwner && !isSubmitting && (
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="absolute bottom-2 right-2 flex items-center gap-1.5 text-xs font-medium bg-black/60 text-white px-2.5 py-1 rounded-full hover:bg-black/80 transition-colors"
              >
                <Upload className="size-3" />
                {cabinet.bannerUrl && !bannerPreview ? "Trocar" : "Adicionar"}
              </button>
            )}
          </div>

          <Input
            type="file"
            ref={bannerInputRef}
            className="hidden"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleBannerSelect}
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Recomendado: 1200×400 px. Formatos: JPG, PNG ou WebP. Máx. 5 MB.
          </p>
        </FieldGroup>

        {/* ── QR Code ── */}
        <FieldGroup>
          <div className="flex items-center gap-2 mb-3">
            <QrCode className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">QR Code do perfil</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-3 bg-white rounded-xl border border-border shadow-sm shrink-0">
              <QRCodeSVG
                value={publicUrl}
                size={128}
                fgColor={accentColor}
                bgColor="#ffffff"
                level="M"
              />
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Imprima em panfletos, banners e cartões. Ao escanear, o cidadão é direcionado
                direto ao perfil do seu gabinete para registrar uma demanda.
              </p>
              <Field>
                <Label className="text-xs">URL do perfil público</Label>
                <div className="flex items-center h-9 rounded-md border border-border bg-muted/30 px-3 text-sm text-muted-foreground font-mono truncate">
                  {publicUrl}
                </div>
              </Field>
            </div>
          </div>
        </FieldGroup>

        {/* ── Widget embed ── */}
        <FieldGroup>
          <div className="flex items-center gap-2 mb-3">
            <Code2 className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Widget para seu site</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            Cole este código no site oficial. Um botão flutuante aparecerá para que os cidadãos
            enviem demandas diretamente.
          </p>
          <div className="relative">
            <pre className="bg-muted/50 border border-border rounded-lg px-4 py-3 text-xs font-mono text-foreground/80 overflow-x-auto whitespace-pre-wrap break-all">
              {widgetCode}
            </pre>
            <button
              type="button"
              onClick={copyWidget}
              className="absolute top-2 right-2 flex items-center gap-1.5 text-xs font-medium bg-background border border-border rounded-md px-2.5 py-1 hover:bg-muted transition-colors"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-500" />
                  <span className="text-emerald-600">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  Copiar
                </>
              )}
            </button>
          </div>
        </FieldGroup>
      </CardContent>

      <BannerCropDialog
        open={cropOpen}
        imageSrc={cropSource}
        onConfirm={handleCropConfirm}
        onCancel={handleCropCancel}
      />

      <CardFooter className="px-6 py-4 border-t border-border flex items-center justify-between">
        {isOwner ? (
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            size="sm"
            className="ml-auto"
          >
            {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
            Salvar personalização
          </Button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5 shrink-0" />
            <span>Apenas o responsável pelo gabinete pode editar.</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
