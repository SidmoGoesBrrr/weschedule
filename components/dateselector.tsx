'use client'

import { startOfMonth, startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export function DateSelector(props: any) {
    return (
        <Calendar
            mode="multiple"
            selected={props.dates}
            onSelect={props.updateFormCallback}
            disabled={(date: Date) => date < startOfToday()}
            startMonth={startOfMonth(new Date())}
        />
    )
}