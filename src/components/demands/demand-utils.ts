import { DemandPriority, DemandStatus } from "@/types/demand-types"

export interface ConfigItem {
    label: string
    className: string
}

export const DEMAND_STATUS_CONFIG: Record<DemandStatus, ConfigItem> = {
    [DemandStatus.SUBMITTED]: {
        label: "Submetido",
        className: "border-blue-200 bg-blue-50 text-blue-600"
    },
    [DemandStatus.IN_ANALYSIS]: {
        label: "Em Análise",
        className: "border-amber-200 bg-amber-50 text-amber-700"
    },
    [DemandStatus.IN_PROGRESS]: {
        label: "Em Andamento",
        className: "border-cyan-200 bg-cyan-50 text-cyan-700"
    },
    [DemandStatus.RESOLVED]: {
        label: "Resolvido",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700"
    },
    [DemandStatus.REJECTED]: {
        label: "Rejeitado",
        className: "border-red-200 bg-red-50 text-red-500"
    },
}

export const DEMAND_PRIORITY_CONFIG: Record<DemandPriority, ConfigItem> = {
    [DemandPriority.URGENT]: {
        label: "Urgente",
        className: "border-red-200 bg-red-50 text-red-600"
    },
    [DemandPriority.HIGH]: {
        label: "Alta",
        className: "border-orange-200 bg-orange-50 text-orange-600"
    },
    [DemandPriority.MEDIUM]: {
        label: "Média",
        className: "border-blue-200 bg-blue-50 text-blue-600"
    },
    [DemandPriority.LOW]: {
        label: "Baixa",
        className: "border-zinc-200 bg-zinc-50 text-zinc-600"
    },
}

export const STATUS_OPTIONS = Object.entries(DEMAND_STATUS_CONFIG).map(([value, config]) => ({
    value: value as DemandStatus,
    label: config.label,
}))

export const PRIORITY_OPTIONS = Object.entries(DEMAND_PRIORITY_CONFIG).map(([value, config]) => ({
    value: value as DemandPriority,
    label: config.label,
}))
