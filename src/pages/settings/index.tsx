import { useState, useMemo } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Tabs as TabsPrimitive } from "radix-ui";
import { PersonalInfoCard } from "./components/personal-info-card";
import { CabinetInfoCard } from "./components/cabinet-info-card";
import { SecurityCard } from "./components/security-card";
import { useAuth } from "@/hooks/use-auth";
import { User, Building2, Monitor } from "lucide-react";
import { UserRole } from "@/api/users/types";

const TAB_ICONS: Record<string, React.ElementType> = {
  profile: User,
  cabinet: Building2,
  system: Monitor,
};

export function Settings() {
  const { user } = useAuth();
  const [active, setActive] = useState("profile");

  const tabs = useMemo(() => [
    { value: "profile", label: "Meu Perfil" },
    ...(user?.isCabinetMember ? [{ value: "cabinet", label: "Meu Gabinete" }] : []),
  ], [user?.isCabinetMember]);

  return (
    <div className="flex-1 px-4 sm:px-8 lg:px-12 pt-8 pb-16">
      <div className="max-w-6xl mx-auto">

        <header className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {user?.role === UserRole.CITIZEN ?
              'Gerencie suas informações pessoais.'
              : 'Gerencie suas informações pessoais e configurações do gabinete.'
            }
          </p>
        </header>

        <Tabs value={active} onValueChange={setActive} className="w-full">
          <div className="flex flex-col md:flex-row gap-0 md:gap-10">
            <aside className="md:w-44 shrink-0">
              <div className="md:hidden overflow-x-auto pb-px mb-6">
                <TabsPrimitive.List className="flex border-b border-border/50 min-w-max">
                  {tabs.map((tab) => {
                    const Icon = TAB_ICONS[tab.value] ?? User;
                    return (
                      <TabsPrimitive.Trigger
                        key={tab.value}
                        value={tab.value}
                        className="group relative flex items-center gap-2 px-4 pb-3 pt-1 text-sm font-semibold text-muted-foreground outline-none transition-colors data-[state=active]:text-foreground whitespace-nowrap"
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        {tab.label}
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-200 origin-left" />
                      </TabsPrimitive.Trigger>
                    );
                  })}
                </TabsPrimitive.List>
              </div>

              <TabsPrimitive.List className="hidden md:flex flex-col gap-0.5">
                {tabs.map((tab) => {
                  const Icon = TAB_ICONS[tab.value] ?? User;
                  return (
                    <TabsPrimitive.Trigger
                      key={tab.value}
                      value={tab.value}
                      className="group relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground outline-none rounded-sm transition-all duration-150 hover:text-foreground hover:bg-muted/50 data-[state=active]:text-foreground data-[state=active]:bg-muted/60 data-[state=active]:font-semibold"
                    >
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full scale-y-0 group-data-[state=active]:scale-y-100 transition-transform duration-200 origin-center" />
                      <Icon className="w-4 h-4 shrink-0 transition-colors" />
                      {tab.label}
                    </TabsPrimitive.Trigger>
                  );
                })}

                {/* <div className="mt-8 pt-6 border-t border-border/40">
                  <p className="text-[11px] text-muted-foreground/60 leading-relaxed px-3">
                    Precisa de ajuda?{" "}
                    <a
                      href="#"
                      className="font-semibold text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
                    >
                      Suporte
                    </a>
                  </p>
                </div> */}
              </TabsPrimitive.List>
            </aside>

            <main className="flex-1 min-w-0">
              <TabsContent value="profile" className="space-y-4 outline-none focus-visible:ring-0 mt-0">
                <PersonalInfoCard />
                <SecurityCard />
              </TabsContent>

              <TabsContent value="cabinet" className="space-y-4 outline-none focus-visible:ring-0 mt-0">
                <CabinetInfoCard />
              </TabsContent>
            </main>
          </div>

          {/* Mobile footer */}
          <footer className="md:hidden mt-10 pt-6 border-t border-border/40 text-center">
            <p className="text-sm text-muted-foreground">
              Precisa de ajuda?{" "}
              <a href="#" className="font-semibold hover:text-primary transition-colors underline underline-offset-4">
                Suporte Central
              </a>
            </p>
          </footer>
        </Tabs>
      </div >
    </div >
  );
}
