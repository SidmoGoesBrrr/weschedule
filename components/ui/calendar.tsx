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
        nav: "absolute justify-center inline-flex items-center gap-1",
        caption:
          "flex justify-center pt-1 relative items-center w-full text-main-foreground",
        caption_label: "text-sm font-heading",
        month_caption: "text-right",
        button_previous:
          "border-2 border-border rounded-base cursor-pointer transition-all duration-150 hover:bg-main/20 hover:border-black hover:scale-105 aria-disabled:!cursor-default aria-disabled:pointer-events-none aria-disabled:opacity-40 aria-disabled:hover:!scale-100 aria-disabled:hover:!bg-transparent aria-disabled:hover:!border-border",
        button_next:
          "border-2 border-border rounded-base cursor-pointer transition-all duration-150 hover:bg-main/20 hover:border-black hover:scale-105 aria-disabled:!cursor-default aria-disabled:pointer-events-none aria-disabled:opacity-40 aria-disabled:hover:!scale-100 aria-disabled:hover:!bg-transparent aria-disabled:hover:!border-border",
        chevron: "fill-current text-main-foreground",
        table: "w-full border-collapse space-y-2",
        day_button: "size-9 p-0 font-base aria-selected:opacity-100 rounded-base border-2 border-border cursor-pointer transition-all duration-150 hover:bg-main/20 hover:border-black hover:scale-110 m-1",
        selected: "bg-black! text-white! rounded-base",
        today: "bg-blue-600 text-white! rounded-base",
        outside: "text-foreground opacity-20 aria-selected:bg-none",
        disabled:
          "!cursor-default pointer-events-none text-foreground/40 bg-transparent hover:!scale-100 hover:!bg-transparent hover:!border-border",
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
