'use client';

import { Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { TimeComboBox } from "@/components/timecombobox";
import { DateSelector } from "@/components/dateselector";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d$/;

const timeslotSchema = z
    .object({
        date: z
            .string()
            .min(1, "Date is required")
            .regex(isoDateRegex, "Date must be YYYY-MM-DD"),
        start: z
            .string()
            .min(1, "Start time is required")
            .regex(timeRegex, "Start must be HH:MM (24h)"),
        end: z
            .string()
            .min(1, "End time is required")
            .regex(timeRegex, "End must be HH:MM (24h)"),
    })
    .refine((data) => data.start < data.end, {
        message: "Start time must be before end time",
        path: ["end"],
    });

const formSchema = z.object({
    title: z.string().min(1).max(50),
    description: z.string().min(0).max(1000),
    location: z.string().min(0).max(200),
    dates: z.array(z.iso.date()),
    sameTimesForAll: z.boolean(),
    timeslots: z.array(timeslotSchema).min(1, 'Add at least one timeslot'),
});

export function EventCreatorForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            location: "",
            dates: [],
            sameTimesForAll: false,
            timeslots: [],
        },
    });

    const { setValue, getValues } = form;
    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: "timeslots",
    });
    const watchedDates = form.watch("dates") ?? [];
    const sameTimesForAll = form.watch("sameTimesForAll");
    const dates = watchedDates.map((d) => new Date(d + "T00:00:00")); // parse as local

    const syncTimeslotsForAllDates = (baseSlots: { start: string; end: string }[]) => {
        const isoDates = getValues("dates") ?? [];
        if (!isoDates.length) {
            replace([]);
            return;
        }
        const expanded = isoDates.flatMap((date: string) =>
            baseSlots.map((slot) => ({
                date,
                start: slot.start,
                end: slot.end,
            })),
        );
        replace(expanded);
    };

    const updateDates = (newDates: Date[]) => {
        const isoStrings = newDates.map((d) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
        });
        setValue("dates", isoStrings, { shouldValidate: true });

        // Keep timeslots only for currently selected dates
        const currentSlots = getValues("timeslots") ?? [];
        const filtered = currentSlots.filter(
            (slot: { date: string }) => isoStrings.includes(slot.date),
        );
        replace(filtered);

        // If using the same times for all days, ensure new dates get
        // the canonical set of timeslots.
        if (sameTimesForAll && isoStrings.length > 0) {
            const baseDate = isoStrings[0];
            let baseSlots =
                (getValues("timeslots") ?? []).filter(
                    (slot: { date: string }) => slot.date === baseDate,
                ) ?? [];

            if (baseSlots.length === 0) {
                baseSlots = [{ date: baseDate, start: "", end: "" }];
            }

            const baseShapes = baseSlots.map((s: { start: string; end: string }) => ({
                start: s.start,
                end: s.end,
            }));
            syncTimeslotsForAllDates(baseShapes);
        }
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        // only called when schema matches
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex justify-center">
                    <div className="w-full max-w-3xl rounded-xl border border-[var(--border)] bg-[var(--secondary-background)] p-6 shadow-[var(--shadow)]">
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Event Title*</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name your event" className="w-full" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Event Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Give it a cool description" className="w-full" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Event Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Where2meet?" className="w-full" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="w-full max-w-3xl rounded-xl border border-[var(--border)] bg-[var(--secondary-background)] p-6 shadow-[var(--shadow)]">
                        <div className="flex flex-row flex-wrap justify-center items-start gap-8">
                            <FormField
                                control={form.control}
                                name="dates"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>When are you available?</FormLabel>
                                        <FormControl>
                                            <DateSelector dates={dates} updateFormCallback={updateDates} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col gap-6 w-full">
                                <FormField
                                    control={form.control}
                                    name="sameTimesForAll"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center gap-2">
                                            <FormControl>
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 cursor-pointer border-2 border-border rounded-sm accent-black"
                                                    checked={!!field.value}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        field.onChange(checked);

                                                        if (checked) {
                                                            const isoDates = getValues("dates") ?? [];
                                                            if (!isoDates.length) return;

                                                            const baseDate = isoDates[0];
                                                            let baseSlots =
                                                                (getValues("timeslots") ?? []).filter(
                                                                    (slot: { date: string }) =>
                                                                        slot.date === baseDate,
                                                                ) ?? [];

                                                            if (baseSlots.length === 0) {
                                                                baseSlots = [
                                                                    { date: baseDate, start: "", end: "" },
                                                                ];
                                                            }

                                                            const baseShapes = baseSlots.map(
                                                                (s: { start: string; end: string }) => ({
                                                                    start: s.start,
                                                                    end: s.end,
                                                                }),
                                                            );
                                                            syncTimeslotsForAllDates(baseShapes);
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className="!mt-0">
                                                Use the same timeslots for all selected days
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                                {watchedDates.length === 0 ? (
                                    <p className="text-sm text-foreground/70">
                                        Select at least one date to add timeslots.
                                    </p>
                                ) : (
                                    watchedDates.map((dateIso) => {
                                        const dateLabel = new Date(
                                            dateIso + "T00:00:00",
                                        ).toLocaleDateString(undefined, {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        });

                                        const dateFields = fields
                                            .map((field, index) => ({ field, index }))
                                            .filter(({ field }) => field.date === dateIso);

                                        return (
                                            <div key={dateIso} className="space-y-3 w-full">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-heading text-sm">
                                                        {dateLabel}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="noShadow"
                                                        onClick={() => {
                                                            if (sameTimesForAll) {
                                                                const isoDates = getValues("dates") ?? [];
                                                                if (!isoDates.length) return;

                                                                const baseDate = isoDates[0];
                                                                const allSlots = getValues("timeslots") ?? [];
                                                                const baseSlots =
                                                                    allSlots.filter(
                                                                        (slot: { date: string }) =>
                                                                            slot.date === baseDate,
                                                                    ) ?? [];

                                                                const baseShapes = baseSlots.map(
                                                                    (s: { start: string; end: string }) => ({
                                                                        start: s.start,
                                                                        end: s.end,
                                                                    }),
                                                                );
                                                                baseShapes.push({ start: "", end: "" });
                                                                syncTimeslotsForAllDates(baseShapes);
                                                            } else {
                                                                append({
                                                                    date: dateIso,
                                                                    start: "",
                                                                    end: "",
                                                                });
                                                            }
                                                        }}
                                                        className="h-8 px-3 text-xs"
                                                    >
                                                        <Plus className="size-3 mr-1" />
                                                        Add timeslot
                                                    </Button>
                                                </div>
                                                {dateFields.length === 0 ? (
                                                    <p className="text-xs text-foreground/60 italic">
                                                        No timeslots for this day yet.
                                                    </p>
                                                ) : (
                                                    <div className="flex flex-col gap-4">
                                                        {dateFields.map(({ field, index }, localIndex) => {
                                                            const allSlots = form.watch("timeslots") ?? [];
                                                            const slot =
                                                                allSlots[index] ?? {
                                                                    date: dateIso,
                                                                    start: "",
                                                                    end: "",
                                                                };
                                                            return (
                                                                <div
                                                                    key={field.id}
                                                                    className="flex flex-row flex-wrap items-end justify-center gap-4 rounded-lg border border-border bg-background/50 p-4"
                                                                >
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`timeslots.${index}.start`}
                                                                        render={() => (
                                                                            <FormItem>
                                                                                <FormLabel>Start</FormLabel>
                                                                                <FormControl>
                                                                                    <TimeComboBox
                                                                                        value={slot.start}
                                                                                        latest={slot.end}
                                                                                        updateFormCallback={(v: string) => {
                                                                                            if (sameTimesForAll) {
                                                                                                const isoDates =
                                                                                                    getValues("dates") ??
                                                                                                    [];
                                                                                                if (!isoDates.length)
                                                                                                    return;
                                                                                                const baseDate =
                                                                                                    isoDates[0];
                                                                                                const all =
                                                                                                    getValues(
                                                                                                        "timeslots",
                                                                                                    ) ?? [];
                                                                                                let baseSlots =
                                                                                                    all.filter(
                                                                                                        (s: {
                                                                                                            date: string;
                                                                                                        }) =>
                                                                                                            s.date ===
                                                                                                            baseDate,
                                                                                                    ) ?? [];
                                                                                                while (
                                                                                                    baseSlots.length <=
                                                                                                    localIndex
                                                                                                ) {
                                                                                                    baseSlots.push({
                                                                                                        date: baseDate,
                                                                                                        start: "",
                                                                                                        end: "",
                                                                                                    });
                                                                                                }
                                                                                                const baseShapes =
                                                                                                    baseSlots.map(
                                                                                                        (
                                                                                                            s: {
                                                                                                                start: string;
                                                                                                                end: string;
                                                                                                            },
                                                                                                            i: number,
                                                                                                        ) => ({
                                                                                                            start:
                                                                                                                i ===
                                                                                                                localIndex
                                                                                                                    ? v
                                                                                                                    : s.start,
                                                                                                            end: s.end,
                                                                                                        }),
                                                                                                    );
                                                                                                syncTimeslotsForAllDates(
                                                                                                    baseShapes,
                                                                                                );
                                                                                            } else {
                                                                                                setValue(
                                                                                                    `timeslots.${index}.start`,
                                                                                                    v,
                                                                                                );
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`timeslots.${index}.end`}
                                                                        render={() => (
                                                                            <FormItem>
                                                                                <FormLabel>End</FormLabel>
                                                                                <FormControl>
                                                                                    <TimeComboBox
                                                                                        value={slot.end}
                                                                                        earliest={slot.start}
                                                                                        updateFormCallback={(v: string) => {
                                                                                            if (sameTimesForAll) {
                                                                                                const isoDates =
                                                                                                    getValues("dates") ??
                                                                                                    [];
                                                                                                if (!isoDates.length)
                                                                                                    return;
                                                                                                const baseDate =
                                                                                                    isoDates[0];
                                                                                                const all =
                                                                                                    getValues(
                                                                                                        "timeslots",
                                                                                                    ) ?? [];
                                                                                                let baseSlots =
                                                                                                    all.filter(
                                                                                                        (s: {
                                                                                                            date: string;
                                                                                                        }) =>
                                                                                                            s.date ===
                                                                                                            baseDate,
                                                                                                    ) ?? [];
                                                                                                while (
                                                                                                    baseSlots.length <=
                                                                                                    localIndex
                                                                                                ) {
                                                                                                    baseSlots.push({
                                                                                                        date: baseDate,
                                                                                                        start: "",
                                                                                                        end: "",
                                                                                                    });
                                                                                                }
                                                                                                const baseShapes =
                                                                                                    baseSlots.map(
                                                                                                        (
                                                                                                            s: {
                                                                                                                start: string;
                                                                                                                end: string;
                                                                                                            },
                                                                                                            i: number,
                                                                                                        ) => ({
                                                                                                            start:
                                                                                                                s.start,
                                                                                                            end:
                                                                                                                i ===
                                                                                                                localIndex
                                                                                                                    ? v
                                                                                                                    : s.end,
                                                                                                        }),
                                                                                                    );
                                                                                                syncTimeslotsForAllDates(
                                                                                                    baseShapes,
                                                                                                );
                                                                                            } else {
                                                                                                setValue(
                                                                                                    `timeslots.${index}.end`,
                                                                                                    v,
                                                                                                );
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="noShadow"
                                                                        size="icon"
                                                                        onClick={() => {
                                                                            if (sameTimesForAll) {
                                                                                const isoDates =
                                                                                    getValues("dates") ?? [];
                                                                                if (!isoDates.length) return;
                                                                                const baseDate = isoDates[0];
                                                                                const all =
                                                                                    getValues("timeslots") ?? [];
                                                                                const baseSlots =
                                                                                    all.filter(
                                                                                        (s: { date: string }) =>
                                                                                            s.date === baseDate,
                                                                                    ) ?? [];
                                                                                if (!baseSlots.length) return;
                                                                                const baseShapes = baseSlots
                                                                                    .filter(
                                                                                        (_: any, i: number) =>
                                                                                            i !== localIndex,
                                                                                    )
                                                                                    .map(
                                                                                        (s: {
                                                                                            start: string;
                                                                                            end: string;
                                                                                        }) => ({
                                                                                            start: s.start,
                                                                                            end: s.end,
                                                                                        }),
                                                                                    );
                                                                                if (!baseShapes.length) {
                                                                                    // allow clearing all slots
                                                                                    replace([]);
                                                                                } else {
                                                                                    syncTimeslotsForAllDates(
                                                                                        baseShapes,
                                                                                    );
                                                                                }
                                                                            } else {
                                                                                remove(index);
                                                                            }
                                                                        }}
                                                                        className="shrink-0"
                                                                        aria-label="Remove timeslot"
                                                                    >
                                                                        <Trash2 className="size-4" />
                                                                    </Button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    )
}