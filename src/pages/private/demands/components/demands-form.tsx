import { useCallback, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { CategoriesApi } from "@/api/categories";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputForm } from "@/components/ui/form/input-form";
import { TextareaForm } from "@/components/ui/form/textarea-form";
import { AsyncSelectForm } from "@/components/ui/form/async-select-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { Loading } from "@/components/loading";
import { useGetCitiesFromState, useGetStates } from "@/api/ibge/hooks";
import { VirtualSelectForm } from "@/components/ui/form/virtual-select-form";
import { OpenStreetMapApi } from "@/api/openstreetmap";
import { toast } from "sonner";
import { useCreateDemand } from "@/api/demands/hooks";
import { ImageDropzoneForm } from "@/components/ui/form/image-dropzone-form";

const newDemandSchema = z.object({
  title: z.string().min(3, "O título deve conter no mínimo 3 caracteres"),
  description: z
    .string()
    .min(10, "A descrição deve conter no mínimo 10 caracteres"),
  categoryId: z.string({
    error: "Selecione uma categoria",
  }),
  state: z.string({ error: "Selecione um estado" }),
  city: z.string({ error: "Selecione uma cidade" }),
  address: z
    .string({ error: "Informe o endereço" })
    .min(3, "Informe o endereço"),
  files: z
    .array(z.instanceof(File), { error: "Envie pelo menos um arquivo" })
    .min(1, "Envie pelo menos um arquivo"),
});

type NewDemandFormData = z.infer<typeof newDemandSchema>;

export function DemandsForm() {
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<NewDemandFormData>({
    resolver: zodResolver(newDemandSchema),
    defaultValues: {
      title: "",
      address: "",
      description: "",
      city: undefined,
      state: undefined,
      categoryId: undefined,
    },
  });

  const { handleSubmit, control } = form;
  const selectedState = useWatch({ control, name: "state" });

  const { data: states } = useGetStates();

  const { data: citiesFromState, isLoading: isLoadingCitiesFromState } =
    useGetCitiesFromState(selectedState ?? "");

  const { mutateAsync: createDemand, isPending: isPendingCreateDemand } =
    useCreateDemand();

  const fetchCategoryOptions = useCallback(
    async ({ page }: { page: number }) => {
      const result = await CategoriesApi.getCategories({
        page,
        limit: 10,
      });
      return {
        options: result.items.map((cat) => ({
          value: cat.id,
          label: cat.name,
        })),
        hasNextPage: page < result.lastPage,
      };
    },
    [],
  );

  const onSubmit = handleSubmit(
    async ({
      address,
      categoryId,
      city,
      description,
      state,
      title,
      files,
    }: NewDemandFormData) => {
      try {
        const [coords] = await OpenStreetMapApi.getGeocodeAddress({
          city,
          state,
          address,
        });
        const { lat, lon } = coords;
        if (coords) {
          await createDemand({
            title,
            files,
            categoryId,
            description,
            latitude: lat,
            longitude: lon,
            address: `${address} - ${city} - ${state}`,
          });
          toast.success("Demanda criada com sucesso!");
          setOpenDialog(false);
          form.reset();
        }
      } catch {
        toast.error("Erro ao criar demanda. Tente novamente.");
      }
    },
  );

  const toggleOpenChange = () => {
    setOpenDialog((prev) => !prev);
  };

  const isFormPending = isPendingCreateDemand || isLoadingCitiesFromState;
  return (
    <Dialog open={openDialog} onOpenChange={toggleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" variant="default">
          <PlusIcon className="size-4" />
          Nova Demanda
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-2xl ">
        <DialogHeader>
          <DialogTitle>Criação de nova demanda</DialogTitle>
          <DialogDescription>
            Registre sua nova demanda que o gabinete irá cuidar dele para você.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="py-2">
          <FieldGroup className="no-scrollbar max-h-[70vh] overflow-y-auto px-4">
            <Field>
              <FieldLabel>Título</FieldLabel>
              <InputForm
                name="title"
                control={control}
                disabled={isFormPending}
                placeholder="Digite aqui o título da sua demanda"
              />
            </Field>

            <Field>
              <FieldLabel>Descrição</FieldLabel>
              <TextareaForm
                name="description"
                control={control}
                disabled={isFormPending}
                placeholder="Digita aqui a sua descrição"
              />
            </Field>

            <Field>
              <FieldLabel>Categoria</FieldLabel>
              <AsyncSelectForm
                name="categoryId"
                control={control}
                disabled={isFormPending}
                fetchOptions={fetchCategoryOptions}
                placeholder="Selecione uma categoria"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>Estado</FieldLabel>
                <VirtualSelectForm
                  name="state"
                  options={
                    states?.map((item) => ({
                      label: `${item.sigla} - ${item.nome}`,
                      value: item.sigla,
                    })) ?? []
                  }
                  control={control}
                  placeholder="Selecione um estado"
                  disabled={!states || states.length === 0 || isFormPending}
                />
              </Field>

              <Field>
                <FieldLabel>Cidade</FieldLabel>
                {isLoadingCitiesFromState ? (
                  <Loading />
                ) : (
                  <VirtualSelectForm
                    name="city"
                    control={control}
                    options={
                      citiesFromState?.map((item) => {
                        return {
                          label: item.nome,
                          value: item.nome,
                        };
                      }) || []
                    }
                    placeholder={
                      !selectedState
                        ? "Selecione um estado primeiro"
                        : isLoadingCitiesFromState
                          ? "Carregando..."
                          : "Selecione uma cidade"
                    }
                    disabled={
                      !selectedState ||
                      isLoadingCitiesFromState ||
                      isFormPending
                    }
                  />
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel>Endereço</FieldLabel>
              <InputForm
                name="address"
                control={control}
                placeholder="Ex: Rua das Flores, 123"
              />
            </Field>

            <Field>
              <FieldLabel>Evidências</FieldLabel>
              <ImageDropzoneForm name="files" control={control} />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isFormPending}>
              Criar demanda
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
