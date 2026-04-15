import { CategoriesApi } from "@/api/categories";
import {
  useCreateDemand,
  useGeneratePresignedUploadUrl,
  useUploadToR2,
  useConfirmEvidenceUpload,
} from "@/api/demands/hooks";
import { AsyncSelectForm } from "@/components/form/async-select-form";
import { ImageDropzoneForm } from "@/components/form/image-dropzone-form";
import { InputForm } from "@/components/form/input-form";
import { TextareaForm } from "@/components/form/textarea-form";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { useAuth } from "@/hooks/use-auth";
import { demandSchema, type DemandFormData } from "@/validation-schemas/demand";
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
  const { isAuthenticated } = useAuth();

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
  const { mutateAsync: generatePresignedUrl, isPending: isPendingPresignedUrl } =
    useGeneratePresignedUploadUrl();
  const { mutateAsync: uploadToR2, isPending: isPendingUpload } = useUploadToR2();
  const { mutateAsync: confirmEvidence, isPending: isPendingConfirm } =
    useConfirmEvidenceUpload();

  const submitLabelRef = useRef("Criar demanda");
  const isFormSubmitting =
    isPendingCreateDemand ||
    isPendingPresignedUrl ||
    isPendingUpload ||
    isPendingConfirm;

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
    if (!isAuthenticated && !data.guestEmail) {
      form.setError("guestEmail", { message: "Digite seu e-mail para continuar" });
      return;
    }

    try {
      submitLabelRef.current = "Criando demanda...";
      const demand = await createDemand({
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        priority: data.priority as import("@/api/demands/types").DemandPriority | undefined,
        address: data.location?.address,
        zipcode: data.location?.zipcode,
        lat: data.location ? parseFloat(data.location.latitude) : undefined,
        long: data.location ? parseFloat(data.location.longitude) : undefined,
        neighborhood: data.location?.neighborhood,
        city: data.location?.city,
        state: data.location?.state,
        guestEmail: !isAuthenticated ? data.guestEmail : undefined,
      });

      if (data.files?.length) {
        submitLabelRef.current = "Enviando evidências...";

        for (const file of data.files) {
          const { uploadUrl, storageKey } = await generatePresignedUrl({
            demandId: demand.id,
            filename: file.name,
          });

          await uploadToR2({ uploadUrl, file });

          await confirmEvidence({
            demandId: demand.id,
            storageKey,
            size: file.size,
          });
        }
      }

      toast.success("Demanda criada com sucesso!");
      setOpenSheet(false);
      form.reset();
    } catch (error) {
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
            {!isAuthenticated && (
              <Field>
                <FieldLabel>Seu e-mail</FieldLabel>
                <InputForm
                  name="guestEmail"
                  control={control}
                  disabled={isFormSubmitting}
                  placeholder="Digite seu e-mail"
                  type="email"
                />
              </Field>
            )}

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