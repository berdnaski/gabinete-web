import { useState } from "react"
import { Loader2, MapPin, Navigation, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAddUserNeighborhood } from "@/api/neighborhood/hooks"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { NeighborhoodSearchInput } from "@/components/ui/location-picker/neighborhood-search-input"

const BRAZIL_STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type Step = "choose" | "detecting" | "form"

async function reverseGeocodeCity(lat: number, lng: number): Promise<{ city: string; state: string }> {
  const key = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}&language=pt-BR`,
  )
  const data = await res.json()
  if (data.status !== "OK" || !data.results?.length) return { city: "", state: "" }

  let city = ""
  let state = ""
  for (const result of data.results) {
    for (const comp of result.address_components as Array<{ long_name: string; short_name: string; types: string[] }>) {
      if (!city && (comp.types.includes("administrative_area_level_2") || comp.types.includes("locality")))
        city = comp.long_name
      if (!state && comp.types.includes("administrative_area_level_1"))
        state = comp.short_name
    }
    if (city && state) break
  }
  return { city, state }
}

interface NeighborhoodSetupProps {
  onSuccess?: () => void
}

export function NeighborhoodSetup({ onSuccess }: NeighborhoodSetupProps) {
  const [step, setStep] = useState<Step>("choose")
  const [locationBias, setLocationBias] = useState<{ lat: number; lng: number } | undefined>()
  const [gpsDetected, setGpsDetected] = useState(false)
  const [gpsError, setGpsError] = useState<string | null>(null)

  const [neighborhood, setNeighborhood] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [label, setLabel] = useState("")

  const { mutateAsync: addNeighborhood, isPending } = useAddUserNeighborhood()

  function resetForm() {
    setNeighborhood("")
    setCity("")
    setState("")
    setLabel("")
    setLocationBias(undefined)
    setGpsDetected(false)
    setGpsError(null)
  }

  async function handleDetectGPS() {
    setGpsError(null)
    setStep("detecting")

    if (!navigator.geolocation) {
      setGpsError("Geolocalização não suportada neste navegador.")
      setStep("form")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        try {
          const { city: detectedCity, state: detectedState } = await reverseGeocodeCity(lat, lng)
          setLocationBias({ lat, lng })
          setCity(detectedCity)
          setState(detectedState)
          setGpsDetected(true)
        } catch {
          setLocationBias({ lat, lng })
        }
        setStep("form")
      },
      () => {
        setGpsError("Permissão de localização negada. Busque manualmente.")
        setStep("form")
      },
      { timeout: 10000, enableHighAccuracy: false, maximumAge: 60000 },
    )
  }

  async function handleConfirm() {
    if (!neighborhood.trim() || !city.trim() || !state.trim()) return
    await addNeighborhood({
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      state: state.trim(),
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
            transition={{ duration: 0.35, ease: EASE }}
            className="w-full max-w-sm flex flex-col items-center text-center gap-6"
          >
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MapPin className="size-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Seu bairro</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Adicione sua localização para ver demandas, gabinetes e resoluções próximos a você.
              </p>
            </div>
            <div className="w-full flex flex-col gap-2.5">
              <Button className="w-full gap-2" onClick={handleDetectGPS}>
                <Navigation className="size-4" />
                Detectar minha localização
              </Button>
              <Button variant="outline" className="w-full gap-2" onClick={() => setStep("form")}>
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

        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="w-full max-w-sm"
          >
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-sm">
              {gpsDetected && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-primary/5 border border-primary/15">
                  <Navigation className="size-4 text-primary shrink-0" />
                  <div>
                    <p className="text-2xs font-semibold uppercase tracking-widest text-primary/70 mb-0.5">
                      GPS detectado
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {city && state ? `${city} · ${state} — confirme seu bairro abaixo` : "Busque seu bairro abaixo"}
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
                  <NeighborhoodSearchInput
                    value={neighborhood}
                    locationBias={locationBias}
                    onSelect={(result) => {
                      setNeighborhood(result.neighborhood)
                      if (result.city) setCity(result.city)
                      if (result.state) setState(result.state)
                    }}
                    onClear={() => setNeighborhood("")}
                    placeholder="Buscar bairro no Maps..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-xs font-semibold">Cidade</Label>
                    <Input
                      placeholder="Ex: Belo Horizonte"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Estado</Label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
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
                  onClick={() => { resetForm(); setStep("choose") }}
                >
                  <X className="size-3.5" />
                  Voltar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleConfirm}
                  disabled={isPending || !neighborhood.trim() || !city.trim() || !state.trim()}
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
