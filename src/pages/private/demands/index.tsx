import { usePageTitle } from "@/hooks/use-page-title";
import { useEffect } from "react";
import { DemandsTable } from "./components/demands-table";

export function Demands() {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle({ title: "Demandas", description: "Visão geral das demandas" });
  }, []);

  return <DemandsTable />;
}
