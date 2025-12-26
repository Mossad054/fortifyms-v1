"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<HTMLInputElement, { onCheckedChange?: (checked: boolean) => void } & React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, onCheckedChange, ...props }, ref) => {

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onCheckedChange) {
                onCheckedChange(e.target.checked)
            }
            if (props.onChange) {
                props.onChange(e)
            }
        }

        return (
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground checked:bg-primary checked:border-primary"
                    ref={ref}
                    onChange={handleChange}
                    {...props}
                />
                <Check className="absolute top-0 left-0 h-4 w-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100" />
            </div>
        )
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
