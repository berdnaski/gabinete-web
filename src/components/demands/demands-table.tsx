import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { demandsColumns } from "./demands-columns";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2Icon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useGetDemands } from "@/api/demands/hooks";
import { DemandPriority, type DemandStatus } from "@/types/demand-types";
import { useDebounce } from "@/hooks/use-debounce";
import type { PaginationState } from "@tanstack/react-table";
import { DemandsFilter } from "./demands-filter";

export function DemandsTable() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [status, setStatus] = useState<DemandStatus | null>(null);
  const [priority, setPriority] = useState<DemandPriority | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: demands, isLoading: isLoadingDemands } = useGetDemands({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    status: status || undefined,
    priority: priority || undefined,
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  });

  const clearAll = () => {
    setStatus(null);
    setPriority(null);
    setDateRange(undefined);
    setSearch("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className="relative">
      {isLoadingDemands && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 border border-zinc-200 backdrop-blur-[0.5px] rounded-xl">
          <Loader2Icon className="size-8 text-[#008EFF] animate-spin" />
        </div>
      )}

      <DataTable
        columns={demandsColumns}
        data={demands?.items || []}
        searchPlaceholder="Buscar por título ou descrição..."
        enableRowSelection
        filterSlot={
          <DemandsFilter
            status={status}
            onStatusChange={(s) => {
              setStatus(s);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            priority={priority}
            onPriorityChange={(p) => {
              setPriority(p);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            dateRange={dateRange}
            onDateRangeChange={(r) => {
              setDateRange(r);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            onClearAll={clearAll}
          />
        }
        toolbarButton={
          <Button
            size="sm"
            className="h-9 gap-1.5 bg-[#008EFF] hover:bg-[#007AE0] text-white font-semibold shadow-sm shrink-0"
          >
            <PlusIcon className="size-4" />
            Nova Demanda
          </Button>
        }
        onBulkDelete={(rows) => console.log("Deletar:", rows)}
        manualPagination
        pageCount={demands?.lastPage || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
      />
    </div>
  );
}
