import { useAuth } from "@/hooks/use-auth";
import { usePageTitle } from "@/hooks/use-page-title";
import { useEffect } from "react";
import { DemandsFeed } from "./components/demands-feed";
import { DemandsTable } from "./components/demands-table";

export function Demands() {
  const { setTitle } = usePageTitle();
  const { user } = useAuth();

  useEffect(() => {
    setTitle({ title: "Demandas", description: "Visão geral das demandas" });
  }, []);

  if (user?.role === "MEMBER") {
    return <DemandsFeed />;
  }

  return <DemandsTable />;
}
