import { useState } from "react"
import { Loader2, MapPin, Navigation, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAddUserNeighborhood } from "@/api/neighborhood/hooks"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const BRAZIL_STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
]

type Step = "choose" | "detecting" | "confirm" | "manual"

interface DetectedLocation {
  neighborhood: string
  city: string
  state: string
}

async function reverseGeocode(lat: number, lng: number): Promise<DetectedLocation> {
  const key = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}&language=pt-BR`
  const res = await fetch(url)
  const data = await res.json()

  if (data.status !== "OK" || !data.results?.length) {
    throw new Error("Geocoding failed")
  }

  let neighborhood = ""
  let city = ""
  let state = ""

  for (const result of data.results) {
    for (const comp of result.address_components as Array<{ long_name: string; short_name: string; types: string[] }>) {
      if (!neighborhood && (comp.types.includes("sublocality_level_1") || comp.types.includes("neighborhood"))) {
        neighborhood = comp.long_name
      }
      if (!city && comp.types.includes("locality")) {
        city = comp.long_name
      }
      if (!state && comp.types.includes("administrative_area_level_1")) {
        state = comp.short_name
      }
    }
    if (city && state) break
  }

  return { neighborhood, city, state }
}

interface NeighborhoodSetupProps {
  onSuccess?: () => void
}

export function NeighborhoodSetup({ onSuccess }: NeighborhoodSetupProps) {
  const [step, setStep] = useState<Step>("choose")
  const [detected, setDetected] = useState<DetectedLocation | null>(null)
  const [gpsError, setGpsError] = useState<string | null>(null)
  const [label, setLabel] = useState("")

  const [manualNeighborhood, setManualNeighborhood] = useState("")
  const [manualCity, setManualCity] = useState("")
  const [manualState, setManualState] = useState("")

  const { mutateAsync: addNeighborhood, isPending } = useAddUserNeighborhood()

  async function handleDetectGPS() {
    setGpsError(null)
    setStep("detecting")

    if (!navigator.geolocation) {
      setGpsError("Geolocalização não suportada neste navegador.")
      setStep("manual")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
          setDetected(loc)
          setManualNeighborhood(loc.neighborhood)
          setManualCity(loc.city)
          setManualState(loc.state)
          setStep("confirm")
        } catch {
          setGpsError("Não conseguimos identificar seu bairro. Tente buscar manualmente.")
          setStep("manual")
        }
      },
      () => {
        setGpsError("Permissão de localização negada. Busque manualmente.")
        setStep("manual")
      },
      { timeout: 10000 },
    )
  }

  async function handleConfirm() {
    const neighborhood = manualNeighborhood.trim()
    const city = manualCity.trim()
    const state = manualState.trim()
    if (!neighborhood || !city || !state) return

    await addNeighborhood({
      neighborhood,
      city,
      state,
      label: label.trim() || undefined,
      isPrimary: true,
    })
    onSuccess?.()
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <AnimatePresence mode="wait">
        {step === "choose" && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="w-full max-w-sm flex flex-col items-center text-center gap-6"
          >
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MapPin className="size-8 text-primary" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Seu bairro</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Adicione sua localização para ver demandas, gabinetes e resoluções
                próximos a você.
              </p>
            </div>

            <div className="w-full flex flex-col gap-2.5">
              <Button className="w-full gap-2" onClick={handleDetectGPS}>
                <Navigation className="size-4" />
                Detectar minha localização
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => setStep("manual")}
              >
                <Search className="size-4" />
                Buscar manualmente
              </Button>
            </div>
          </motion.div>
        )}

        {step === "detecting" && (
          <motion.div
            key="detecting"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Detectando sua localização...</p>
          </motion.div>
        )}

        {(step === "confirm" || step === "manual") && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="w-full max-w-sm"
          >
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-sm">
              {step === "confirm" && detected && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/15">
                  <Navigation className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-2xs font-semibold uppercase tracking-widest text-primary/70 mb-0.5">
                      Localização detectada
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {detected.neighborhood || "Bairro não identificado"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {detected.city}, {detected.state}
                    </p>
                  </div>
                </div>
              )}

              {gpsError && (
                <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                  {gpsError}
                </p>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Bairro</Label>
                  <Input
                    placeholder="Ex: Centro"
                    value={manualNeighborhood}
                    onChange={(e) => setManualNeighborhood(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-xs font-semibold">Cidade</Label>
                    <Input
                      placeholder="Ex: Belo Horizonte"
                      value={manualCity}
                      onChange={(e) => setManualCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Estado</Label>
                    <select
                      value={manualState}
                      onChange={(e) => setManualState(e.target.value)}
                      className={cn(
                        "flex h-8 w-full rounded-md border border-input bg-background px-2",
                        "text-sm ring-offset-background focus-visible:outline-none",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      )}
                    >
                      <option value="">UF</option>
                      {BRAZIL_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Apelido{" "}
                    <span className="font-normal text-muted-foreground">(opcional)</span>
                  </Label>
                  <Input
                    placeholder="Ex: Casa, Trabalho"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    maxLength={30}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => { setStep("choose"); setGpsError(null) }}
                >
                  <X className="size-3.5" />
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleConfirm}
                  disabled={
                    isPending ||
                    !manualNeighborhood.trim() ||
                    !manualCity.trim() ||
                    !manualState.trim()
                  }
                >
                  {isPending && <Loader2 className="size-3.5 animate-spin" />}
                  Salvar bairro
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
