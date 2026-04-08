import { CategoriesApi } from "@/api/categories";
import { useAddEvidences, useCreateDemand } from "@/api/demands/hooks";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { AsyncSelectForm } from "@/components/ui/form/async-select-form";
import { ImageDropzoneForm } from "@/components/ui/form/image-dropzone-form";
import { InputForm } from "@/components/ui/form/input-form";
import { TextareaForm } from "@/components/ui/form/textarea-form";
import { LocationPickerField } from "@/components/ui/location-picker/location-picker-field";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { demandSchema, type DemandFormData } from "@/schemas/demand-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface DemandFormProps {
  sizeTrigger: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg" | null | undefined;
}

export function DemandsForm({ sizeTrigger }: DemandFormProps) {
  const [openSheet, setOpenSheet] = useState(false);

  const form = useForm<DemandFormData>({
    resolver: zodResolver(demandSchema),
    defaultValues: {
      title: "",
      description: "",
      location: undefined,
      categoryId: undefined,
    },
  });

  const { handleSubmit, control, reset } = form;

  const { mutateAsync: createDemand, isPending: isPendingCreateDemand } = useCreateDemand();
  const { mutateAsync: addEvidences, isPending: isPendingAddEvidences } = useAddEvidences();

  const submitLabelRef = useRef("Criar demanda");
  const isFormSubmitting = isPendingCreateDemand || isPendingAddEvidences;

  const fetchCategoryOptions = useCallback(
    async ({ page }: { page: number }) => {
      const result = await CategoriesApi.getCategories({ page, limit: 10 });
      return {
        options: result.items.map((option) => ({
          value: option.id,
          label: option.name,
        })),
        hasNextPage: page < result.meta.totalPages,
      };
    },
    [],
  );

  const onSubmit = handleSubmit(async (data: DemandFormData) => {
    try {
      submitLabelRef.current = "Criando demanda...";
      const demand = await createDemand({
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        priority: data.priority as import("@/types/demand-types").DemandPriority | undefined,
        address: data.location?.address,
        zipcode: data.location?.zipcode,
        lat: data.location ? parseFloat(data.location.latitude) : undefined,
        long: data.location ? parseFloat(data.location.longitude) : undefined,
        neighborhood: data.location?.neighborhood,
        city: data.location?.city,
        state: data.location?.state,
      });

      if (data.files?.length) {
        submitLabelRef.current = "Enviando evidências...";
        const formData = new FormData();
        data.files.forEach((file) => formData.append('evidences', file));
        await addEvidences({ id: demand.id, formData });
      }

      toast.success("Demanda criada com sucesso!");
      setOpenSheet(false);
      form.reset();
    } catch {
      toast.error("Erro ao criar demanda. Tente novamente.");
    } finally {
      submitLabelRef.current = "Criar demanda";
    }
  });

  const toggleOpenChange = () => {
    setOpenSheet((prev) => !prev);
  };

  useEffect(() => {
    reset();
  }, [openSheet])

  return (
    <Sheet open={openSheet} onOpenChange={toggleOpenChange}>
      <SheetTrigger asChild>
        <Button size={sizeTrigger} variant="default" className={sizeTrigger?.includes('icon') ? "rounded-full" : ""}>
          <PlusIcon className="size-4" />
          {sizeTrigger !== "icon" && "Nova Demanda"}
        </Button>
      </SheetTrigger>

      <SheetContent className="min-w-2xl">
        <SheetHeader className="border-b">
          <SheetTitle>Nova demanda</SheetTitle>
        </SheetHeader>
        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <FieldGroup className="flex-1 min-h-0 overflow-y-auto px-4">
            <Field>
              <FieldLabel>Título</FieldLabel>
              <InputForm
                name="title"
                control={control}
                disabled={isFormSubmitting}
                placeholder="Digite aqui o título da sua demanda"
              />
            </Field>

            <Field>
              <FieldLabel>Descrição</FieldLabel>
              <TextareaForm
                name="description"
                control={control}
                disabled={isFormSubmitting}
                placeholder="Digita aqui a sua descrição"
              />
            </Field>

            <Field>
              <FieldLabel>Categoria</FieldLabel>
              <AsyncSelectForm
                name="categoryId"
                control={control}
                disabled={isFormSubmitting}
                fetchOptions={fetchCategoryOptions}
                placeholder="Selecione uma categoria"
              />
            </Field>

            <Field>
              <FieldLabel>Localização</FieldLabel>
              <LocationPickerField
                name="location"
                control={control}
                disabled={isFormSubmitting}
              />
            </Field>

            <Field>
              <FieldLabel>Evidências</FieldLabel>
              <ImageDropzoneForm name="files" control={control} />
            </Field>
          </FieldGroup>

          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancelar</Button>
            </SheetClose>
            <Button type="submit" disabled={isFormSubmitting}>
              {submitLabelRef.current}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}