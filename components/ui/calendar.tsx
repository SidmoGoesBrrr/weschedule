"use client"

import { DayPicker, getDefaultClassNames } from "react-day-picker"

import * as React from "react"

import { buttonVariants } from "@/components/ui/button"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      classNames={{
        root: cn(
          "rounded-base! border-2 border-border bg-main p-3 font-heading shadow-shadow calendar-outline-wrapper w-min",
          className
        ),
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        nav: "absolute justify-center inline-flex items-center transform rotate-180 origin-center",
        caption:
          "flex justify-center pt-1 relative items-center w-full text-main-foreground",
        caption_label: "text-sm font-heading",
        month_caption: "text-right",
        button_previous: "border-2 border-border rounded-base",
        button_next: "border-2 border-border rounded-base",
        table: "w-full border-collapse space-y-1",
        day_button: "size-9 p-0 font-base aria-selected:opacity-100 rounded-base border-2 border-border",
        selected: "bg-black! text-white! rounded-base",
        today: "bg-secondary-background text-foreground! rounded-base",
        outside: "text-main-foreground opacity-50 aria-selected:bg-none",
        disabled: "text-main-foreground opacity-50",
        range_start: "day-range-start bg-black! text-white! rounded-base",
        range_end: "day-range-end bg-black! text-white! rounded-base",
        range_middle: "bg-black/50! text-white!",
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
