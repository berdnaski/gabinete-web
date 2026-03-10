import {
    useController,
    type FieldValues,
    type UseControllerProps,
} from 'react-hook-form'

import {
    FieldContent,
    FieldError,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { ComponentProps } from 'react'
import { AlertCircle } from 'lucide-react'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type InputFormProps<T extends FieldValues> = ComponentProps<
    typeof Input
> &
    UseControllerProps<T> & {
        icon?: LucideIcon
    }

export function InputForm<T extends FieldValues>({
    name,
    control,
    icon: Icon,
    className,
    ...props
}: InputFormProps<T>) {

    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
    })

    return (
        <FieldContent>
            <div className="relative flex items-center w-full group">
                {Icon && (
                    <div className="absolute left-3 flex items-center justify-center text-[#008EFF] transition-colors group-focus-within:text-[#008EFF]">
                        <Icon size={18} strokeWidth={2.5} />
                    </div>
                )}
                <Input
                    className={cn(
                        error && 'border-red-500 focus-visible:ring-red-300!',
                        Icon && 'pl-10',
                        "h-12 bg-zinc-50/50 border-zinc-200 rounded-xl focus-visible:ring-[#008EFF]/20 focus-visible:border-[#008EFF]",
                        className
                    )}
                    id={name}
                    {...props}
                    {...field}
                />
            </div>
            {error && (
                <span className="flex items-center gap-0.5 mt-1">
                    <AlertCircle size={12} className="size-3 text-red-500" />
                    <FieldError errors={[error]} className="text-xs" />
                </span>
            )}
        </FieldContent>
    )
}