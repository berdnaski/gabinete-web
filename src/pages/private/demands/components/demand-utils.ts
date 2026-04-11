import { DemandStatus } from "@/api/demands/types"

export { PRIORITY_OPTIONS } from "./demand-priority"

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

export const STATUS_OPTIONS = Object.entries(DEMAND_STATUS_CONFIG).map(([value, config]) => ({
	value: value as DemandStatus,
	label: config.label,
}))
