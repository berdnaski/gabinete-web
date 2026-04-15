import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs as TabsPrimitive } from "radix-ui";
import { PersonalInfoCard } from "./components/personal-info-card";
import { CabinetInfoCard } from "./components/cabinet-info-card";
import { SecurityCard } from "./components/security-card";
import { SettingsCard, SettingsCardHeader } from "./components/settings-ui";
import { useAuth } from "@/hooks/use-auth";

export function Settings() {
  const { user, isLoading } = useAuth();
  const [active, setActive] = useState("profile");

  const tabs = useMemo(() => [
    { value: "profile", label: "Meu Perfil" },
    ...(user?.isCabinetMember ? [{ value: "cabinet", label: "Meu Gabinete" }] : []),
    { value: "system", label: "Sistema" },
  ], [user?.isCabinetMember]);

  if (isLoading) {
    return (
      <div className="flex-1 px-10 pt-8 animate-pulse">
        <header className="mb-8">
          <div className="h-8 w-48 bg-muted rounded-md mb-2" />
          <div className="h-4 w-64 bg-muted/50 rounded-md" />
        </header>
        <div className="h-10 w-full bg-muted/30 rounded-xl mb-8" />
        <div className="space-y-6">
          <div className="h-[400px] w-full bg-muted/20 rounded-[24px]" />
          <div className="h-[200px] w-full bg-muted/20 rounded-[24px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 animate-in fade-in duration-700">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
      </header>

      <Tabs className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Meu perfil</TabsTrigger>
          <TabsTrigger value="test2">Teste 2</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <PersonalInfoCard />
          <SecurityCard />
        </TabsContent>
        <TabsContent value="system">
          <CabinetInfoCard />
        </TabsContent>
      </Tabs>

      <Tabs value={active} onValueChange={setActive} className="w-full">
        <div className="relative border-b border-border/40 mb-8">
          <TabsPrimitive.List className="flex gap-8 relative">
            {tabs.map((tab) => (
              <TabsPrimitive.Trigger
                key={tab.value}
                value={tab.value}
                className="group relative pb-4 text-sm font-bold transition-all outline-none"
              >
                <span className="opacity-50 group-data-[state=active]:opacity-100 transition-opacity">
                  {tab.label}
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300 origin-left" />
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>
        </div>

        <div className="max-w-5xl">
          <TabsContent value="profile" className="space-y-6 outline-none focus-visible:ring-0">
            <PersonalInfoCard />
            <SecurityCard />
          </TabsContent>

          <TabsContent value="cabinet" className="space-y-6 outline-none focus-visible:ring-0">
            <CabinetInfoCard />
          </TabsContent>

          <TabsContent value="system" className="outline-none focus-visible:ring-0">
            <SettingsCard>
              <SettingsCardHeader
                title="Preferências do Sistema"
                description="Configurações gerais da plataforma. Em breve disponíveis."
              />
              <div className="px-8 py-16 text-center text-muted-foreground text-sm font-medium italic">
                Nenhuma configuração disponível no momento.
              </div>
            </SettingsCard>
          </TabsContent>
        </div>

        <footer className="mt-12 pt-8 border-t border-border/40 text-center">
          <p className="text-sm text-muted-foreground">
            Precisa de ajuda?{" "}
            <a href="#" className="font-bold hover:text-primary transition-colors underline underline-offset-4">
              Suporte Central
            </a>
          </p>
        </footer>
      </Tabs>
    </div>
  );
}

