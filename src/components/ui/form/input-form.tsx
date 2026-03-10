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

export type InputFormProps<T extends FieldValues> = ComponentProps<
    typeof Input
> &
    UseControllerProps<T>

export function InputForm<T extends FieldValues>({
    name,
    control,
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
            <Input className={error && 'border-red-500 focus-visible:ring-red-300!'} id={name} {...props} {...field} />
            {error && (
                <span className="flex items-center gap-0.5">
                    <AlertCircle size={12} className="size-3 text-red-500" />
                    <FieldError errors={[error]} className="text-xs" />
                </span>
            )}
        </FieldContent>
    )
}