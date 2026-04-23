import {
  useCreateDemand,
  useGeneratePresignedUploadUrl,
  useUploadToR2,
  useConfirmEvidenceUpload,
} from "@/api/demands/hooks";
import { DemandForm } from "@/components/forms/demand";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names";
import { defaultDemandValues, demandSchema, type DemandFormData } from "@/validation-schemas/demand";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function DialogDemandForm() {
  const { isAuthenticated, user } = useAuth()
  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })

  const form = useForm({
    resolver: zodResolver(demandSchema),
    defaultValues: defaultDemandValues,
  })

  const { mutateAsync: createDemand, isPending: isPendingCreateDemand } = useCreateDemand();
  const { mutateAsync: generatePresignedUrl, isPending: isPendingPresignedUrl } =
    useGeneratePresignedUploadUrl();
  const { mutateAsync: uploadToR2, isPending: isPendingUpload } = useUploadToR2();
  const { mutateAsync: confirmEvidence, isPending: isPendingConfirm } =
    useConfirmEvidenceUpload();

  const { handleSubmit, reset } = form

  const onOpenChangeDialog = (next?: boolean) => {
    if (isUploading) return;
    setOpen(prev => next !== undefined ? next : !prev);
  }

  const onSubmit = handleSubmit(async (data: DemandFormData) => {
    if (!isAuthenticated && !data.guestEmail) {
      form.setError("guestEmail", { message: "Digite seu e-mail para continuar" });
      return;
    }

    try {
      setIsUploading(true);
      const demand = await createDemand({
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
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
        setUploadProgress({ current: 0, total: data.files.length });
        for (let i = 0; i < data.files.length; i++) {
          const file = data.files[i];
          try {
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

            setUploadProgress({ current: i + 1, total: data.files.length });
          } catch (fileError) {
            console.error(`Erro ao fazer upload do arquivo ${file.name}:`, fileError);
            toast.error(`Falha ao enviar ${file.name}`);
          }
        }
      }

      toast.success("Demanda criada com sucesso!");
      onOpenChangeDialog()
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar demanda. Tente novamente.");
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  });

  useEffect(() => {
    reset()
  }, [open, reset])

  return (
    <div className="bg-white rounded shadow-sm flex p-4 gap-2 items-center ">

      {isAuthenticated && user ? (
        <Link to={`/profile/${user.id}`} className="shrink-0">
          <Avatar size="lg">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {getFirstLettersFromNames(user.name)}
            </AvatarFallback>
          </Avatar>
        </Link>
      ) : (
        <Avatar size="lg">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
            <User />
          </AvatarFallback>
        </Avatar>
      )}

      <Dialog open={open} onOpenChange={onOpenChangeDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg" className="rounded-full bg-white flex-1 justify-start h-12">
            Registrar nova demanda
          </Button>
        </DialogTrigger>
        <DialogContent
          className="min-w-1/3 bg-white"
          onInteractOutside={(e) => { if (isUploading) e.preventDefault(); }}
          onEscapeKeyDown={(e) => { if (isUploading) e.preventDefault(); }}
        >
          {isUploading && (
            <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50 rounded-lg">
              <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
              <p className="text-white font-semibold mb-2">Enviando arquivos...</p>
              <p className="text-white/80 text-sm">
                {uploadProgress.current} de {uploadProgress.total}
              </p>
              <div className="w-48 h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{
                    width: uploadProgress.total
                      ? `${(uploadProgress.current / uploadProgress.total) * 100}%`
                      : "0%",
                  }}
                />
              </div>
            </div>
          )}
          <DialogHeader>
            <DialogTitle>Criar demanda</DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form onSubmit={onSubmit}>
              <div className="max-h-[60vh] no-scrollbar overflow-y-auto pb-4 p-1">
                <DemandForm isRequesting={isPendingCreateDemand || isPendingPresignedUrl || isPendingUpload || isPendingConfirm || isUploading} />
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" disabled={isUploading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isUploading || isPendingCreateDemand || isPendingPresignedUrl || isPendingUpload || isPendingConfirm}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Criar demanda"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div >
  )
}