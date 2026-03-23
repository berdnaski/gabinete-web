import { useEffect } from "react";
import { DemandsTable } from "@/components/demands/demands-table";
import { usePageTitle } from "@/hooks/use-page-title";

export function Demands() {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle({ title: "Demandas", description: "Visão geral das demandas" });
  }, []);

  return <DemandsTable />;
}
