"use client"

import * as LabelPrimitive from "@radix-ui/react-label"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Render a styled wrapper around Radix UI's Label primitive.
 *
 * The rendered element includes a `data-slot="label"` attribute, applies default
 * typography and disabled-state utility classes, and merges any provided `className`.
 *
 * @param className - Additional CSS class names appended to the component's default classes
 * @returns A `LabelPrimitive.Root` element with default label styles and merged classes
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-sm font-heading leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  )
}

export { Label }