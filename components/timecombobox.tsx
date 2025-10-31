'use client'

import { useState, useEffect } from 'react'

import { CheckIcon, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from "@/lib/utils"

let times = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
times = times.flatMap((time) => {
    let modTime = time % 12;
    let hourValue = time < 10 ? `0${time}` : `${time}`;
    let hourLabel = modTime < 10 ? `0${modTime}` : `${modTime}`;
    if (time == 0) {
        hourLabel = "12";
    }
    let suffix = time < 12 ? "AM" : "PM";
    return [
        {
            value: `${hourValue}:00`,
            label: `${hourLabel}:00 ${suffix}`
        },
        {
            value: `${hourValue}:15`,
            label: `${hourLabel}:15 ${suffix}`
        },
        {
            value: `${hourValue}:30`,
            label: `${hourLabel}:30 ${suffix}`
        },
        {
            value: `${hourValue}:45`,
            label: `${hourLabel}:45 ${suffix}`
        },
    ]
});
// console.log(times);

export function TimeComboBox(props) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState('00:00');
    let update = (newValue) => {
        props.updateFormCallback(newValue);
        setValue(newValue);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="noShadow"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between md:max-w-[200px]"
                >
                    {value
                        ? times.find((time) => time.value === value)?.label
                        : "Select time..."}
                    <ChevronsUpDown />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) border-0 p-0">
                <Command className="**:data-[slot=command-input-wrapper]:h-11">
                    <CommandInput placeholder="Search times..." />
                    <CommandList className="p-1">
                        <CommandEmpty>No times found.</CommandEmpty>
                        <CommandGroup>
                            {times.map((time) => (
                                <CommandItem
                                    key={time.value}
                                    value={time.label}
                                    onSelect={(currentValue) => {
                                        update(time.value);
                                        setOpen(false);
                                    }}
                                >
                                    {time.label}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto",
                                            value === time.value ? "opacity-100" : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

// export function TimeRangeSelector() {
//     let range = { start: '00:00', end: '00:00' };
//     const setStart = (newStart) => {
//         range.start = newStart;
//         console.log(range);
//     }
//     const setEnd = (newEnd) => {
//         range.end = newEnd;
//         console.log(range);
//     }
//     return (
//         <div>
//             <TimeComboBox def={range.start} callback={setStart} />
//             <TimeComboBox def={range.end} callback={setEnd} />
//         </div>
//     )
// }
