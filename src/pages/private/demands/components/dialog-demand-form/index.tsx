import { useAddEvidences, useCreateDemand } from "@/api/demands/hooks";
import { DemandForm } from "@/components/forms/demand";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { getFirstLettersFromNames } from "@/utils/get-first-letters-from-names";
import { defaultDemandValues, demandSchema, type DemandFormData } from "@/validation-schemas/demand";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export function DialogDemandForm() {
  const { isAuthenticated, user } = useAuth()
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(demandSchema),
    defaultValues: defaultDemandValues,
  })

  const { mutateAsync: createDemand, isPending: isPendingCreateDemand } = useCreateDemand();
  const { mutateAsync: addEvidences, isPending: isPendingAddEvidences } = useAddEvidences();

  const { handleSubmit, reset } = form

  const onOpenChangeDialog = () => {
    setOpen(prevState => !prevState)
  }

  const onSubmit = handleSubmit(async (data: DemandFormData) => {
    if (!isAuthenticated && !data.guestEmail) {
      form.setError("guestEmail", { message: "Digite seu e-mail para continuar" });
      return;
    }

    try {
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
        const formData = new FormData();
        data.files.forEach((file) => formData.append('evidences', file));
        await addEvidences({ id: demand.id, formData });
      }

      toast.success("Demanda criada com sucesso!");
      onOpenChangeDialog()
      form.reset();
    } catch {
      toast.error("Erro ao criar demanda. Tente novamente.");
    }
  });

  useEffect(() => {
    reset()
  }, [open, reset])

  return (
    <div className="bg-white rounded shadow-sm flex p-4 gap-2 items-center ">

      <Avatar size="lg">
        <AvatarImage src={user?.avatarUrl} alt={user?.name} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
          {user?.name ? (
            getFirstLettersFromNames(user?.name as string)
          ) : (
            <User className="size-5" />
          )}
        </AvatarFallback>
      </Avatar>


      <Dialog open={open} onOpenChange={onOpenChangeDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg" className="rounded-full bg-white flex-1 justify-start h-12">
            Registrar nova demanda
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-1/3 bg-white" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Criar demanda</DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form onSubmit={onSubmit}>
              <div className="max-h-[60vh] no-scrollbar overflow-y-auto pb-4 p-1">
                <DemandForm isRequesting={isPendingCreateDemand || isPendingAddEvidences} />
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
                <Button type="submit">Criar demanda</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div >
  )
}