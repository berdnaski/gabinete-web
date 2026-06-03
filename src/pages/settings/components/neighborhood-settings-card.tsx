import { useState } from "react"
import { MapPin, Plus, Star, Trash2, Loader2, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useListUserNeighborhoods,
  useAddUserNeighborhood,
  useRemoveUserNeighborhood,
  useSetPrimaryNeighborhood,
} from "@/api/neighborhood/hooks"
import { cn } from "@/lib/utils"
import { NeighborhoodSearchInput } from "@/components/ui/location-picker/neighborhood-search-input"

const BRAZIL_STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
]

async function reverseGeocodeCity(lat: number, lng: number) {
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
      if (!city && (comp.types.includes("administrative_area_level_2") || comp.types.includes("locality"))) city = comp.long_name
      if (!state && comp.types.includes("administrative_area_level_1")) state = comp.short_name
    }
    if (city && state) break
  }
  return { city, state }
}

export function NeighborhoodSettingsCard() {
  const [open, setOpen] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [gpsError, setGpsError] = useState<string | null>(null)
  const [locationBias, setLocationBias] = useState<{ lat: number; lng: number } | undefined>()
  const [form, setForm] = useState({ neighborhood: "", city: "", state: "", label: "" })

  const { data: neighborhoods = [], isLoading } = useListUserNeighborhoods()
  const { mutateAsync: addNeighborhood, isPending: isAdding } = useAddUserNeighborhood()
  const { mutate: removeNeighborhood } = useRemoveUserNeighborhood()
  const { mutate: setPrimary } = useSetPrimaryNeighborhood()

  async function handleDetect() {
    if (!navigator.geolocation) {
      setGpsError("Seu navegador não suporta geolocalização.")
      return
    }
    setDetecting(true)
    setGpsError(null)
    try {
      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude: lat, longitude: lng } = pos.coords
            try {
              const { city, state } = await reverseGeocodeCity(lat, lng)
              setLocationBias({ lat, lng })
              setForm((f) => ({ ...f, city, state }))
              resolve()
            } catch {
              setLocationBias({ lat, lng })
              resolve()
            }
          },
          (err) => reject(err),
          { timeout: 10000, enableHighAccuracy: false, maximumAge: 60000 },
        )
      })
    } catch (err: unknown) {
      if (err instanceof GeolocationPositionError && err.code === GeolocationPositionError.PERMISSION_DENIED) {
        setGpsError("Permissão negada. Preencha o bairro manualmente.")
      } else if (err instanceof GeolocationPositionError && err.code === GeolocationPositionError.TIMEOUT) {
        setGpsError("Tempo esgotado. Verifique se a localização está ativada no Windows.")
      } else {
        setGpsError("Não foi possível detectar a localização. Preencha manualmente.")
      }
    } finally {
      setDetecting(false)
    }
  }

  async function handleAdd() {
    if (!form.neighborhood.trim() || !form.city.trim() || !form.state.trim()) return
    await addNeighborhood({
      neighborhood: form.neighborhood.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      label: form.label.trim() || undefined,
    })
    setOpen(false)
    setForm({ neighborhood: "", city: "", state: "", label: "" })
  }

  return (
    <>
      <Card className="bg-card rounded-xl border border-border shadow-sm animate-in fade-in duration-300">
        <CardHeader className="px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              <CardTitle className="text-base font-semibold text-foreground">
                Meus Bairros
              </CardTitle>
            </div>
            {neighborhoods.length < 3 && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 h-7 text-xs"
                onClick={() => setOpen(true)}
              >
                <Plus className="size-3" />
                Adicionar
              </Button>
            )}
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Salve até 3 bairros para acompanhar demandas na sua região.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-5">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : neighborhoods.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-2.5">
              <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                <MapPin className="size-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Nenhum bairro salvo ainda.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => setOpen(true)}
              >
                <Plus className="size-3.5" />
                Adicionar bairro
              </Button>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border/40">
              {neighborhoods.map((n) => (
                <div key={n.id} className="flex items-center gap-3 py-3">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="size-3.5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {n.neighborhood}
                      </p>
                      {n.label && (
                        <span className="text-2xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md shrink-0">
                          {n.label}
                        </span>
                      )}
                      {n.isPrimary && (
                        <Star className="size-3 text-amber-400 fill-amber-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {n.city} · {n.state}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!n.isPrimary && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setPrimary(n.id)}
                        title="Definir como principal"
                        className="text-muted-foreground hover:text-amber-500"
                      >
                        <Star className="size-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeNeighborhood(n.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}

              {neighborhoods.length < 3 && (
                <div className="pt-3">
                  <button
                    onClick={() => setOpen(true)}
                    className={cn(
                      "flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border border-dashed border-border",
                      "text-sm text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-muted/30",
                      "transition-colors",
                    )}
                  >
                    <Plus className="size-3.5 shrink-0" />
                    Adicionar outro bairro ({neighborhoods.length}/3)
                  </button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setGpsError(null); setLocationBias(undefined); setForm({ neighborhood: "", city: "", state: "", label: "" }) } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Adicionar bairro</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={handleDetect}
              disabled={detecting}
            >
              {detecting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Navigation className="size-3.5" />
              )}
              {detecting ? "Detectando..." : "Detectar localização"}
            </Button>
            {gpsError && (
              <p className="text-xs text-destructive -mt-1">{gpsError}</p>
            )}

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Bairro</Label>
                <NeighborhoodSearchInput
                  value={form.neighborhood}
                  locationBias={locationBias}
                  onSelect={(result) => setForm((f) => ({
                    ...f,
                    neighborhood: result.neighborhood,
                    city: result.city || f.city,
                    state: result.state || f.state,
                  }))}
                  onClear={() => setForm((f) => ({ ...f, neighborhood: "" }))}
                  placeholder="Buscar bairro no Maps..."
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs font-semibold">Cidade</Label>
                  <Input
                    placeholder="Cidade"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Estado</Label>
                  <select
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    className={cn(
                      "flex h-8 w-full rounded-md border border-input bg-background px-2",
                      "text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    <option value="">UF</option>
                    {BRAZIL_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Apelido <span className="font-normal text-muted-foreground">(opcional)</span>
                </Label>
                <Input
                  placeholder="Ex: Casa, Trabalho"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  maxLength={30}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={isAdding || !form.neighborhood.trim() || !form.city.trim() || !form.state.trim()}
            >
              {isAdding && <Loader2 className="size-3.5 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
