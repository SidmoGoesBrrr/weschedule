'use client';

import Link from "next/link";
import { Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { useForm, useFieldArray } from "react-hook-form"
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod"
import { createEvent } from '@/lib/serverEventUtil';

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { TimeComboBox } from "@/components/timecombobox";
import { DateSelector } from "@/components/dateselector";

const errorMsgs = {
    NO_TITLE: "Event title is required.",
    TITLE_TOO_LONG: "Title is too long: maximum length is 50 characters.",
    DESC_TOO_LONG: "Description too long: maximum length is 1000 characters.",
    LOCATION_TOO_LONG: "Location too long: maximum length is 200 characters.",
    NO_DATES: "Please choose a date(s) for your event.",
    NO_START_TIME: "Please choose a start time.",
    NO_END_TIME: "Please choose an end time.",
}

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d$/;
const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const timeslotSchema = z
    .object({
        date: z
            .string()
            .min(1, "Date is required")
            .regex(isoDateRegex, "Date must be YYYY-MM-DD"),
        start: z
            .string()
            .min(1, errorMsgs.NO_START_TIME)
            .regex(timeRegex, "Start must be HH:MM (24h)"),
        end: z
            .string()
            .min(1, errorMsgs.NO_END_TIME)
            .regex(timeRegex, "End must be HH:MM (24h)"),
    })
    .refine((data) => toMinutes(data.start) < toMinutes(data.end), {
        message: "Start time must be before end time",
        path: ["end"],
    });

const formSchema = z.object({
    title: z.string().min(1, errorMsgs.NO_TITLE).max(50, errorMsgs.TITLE_TOO_LONG),
    description: z.string().min(0).max(1000, errorMsgs.DESC_TOO_LONG),
    location: z.string().min(0).max(200, errorMsgs.LOCATION_TOO_LONG),
    dates: z.array(z.iso.date()).min(1, errorMsgs.NO_DATES),
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

    const router = useRouter();

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
            const currentTimeslots = getValues("timeslots") ?? [];

            // Find the first date that has actual timeslots
            let baseSlots: { start: string; end: string }[] = [];
            for (const dateStr of isoStrings) {
                const slotsForDate = currentTimeslots.filter(
                    (slot: { date: string }) => slot.date === dateStr,
                );
                if (slotsForDate.length > 0) {
                    baseSlots = slotsForDate.map((s: { start: string; end: string }) => ({
                        start: s.start,
                        end: s.end,
                    }));
                    break;
                }
            }

            // Only sync if we found actual base slots to avoid overwriting with blanks
            if (baseSlots.length > 0) {
                syncTimeslotsForAllDates(baseSlots);
            }
        }
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        // only called when schema is valid
        console.log(values);
        async function asyncSubmit() {
            // values to send: title, desc, location, timeslots
            
            
            // let response = { success: true }; //stub
            let timeslotStrings = values.timeslots.map(timeslot => (timeslot.date + ";" + timeslot.start + ";" + timeslot.end));
            let response = await createEvent(values.title, values.description, values.location, timeslotStrings);

            // possible responses
            // warning: event timeslots overlap w/ existing reserved timeslots 
            // failure: not logged in?
            // failure: length restrictions validated on title, desc, and/or location

            // drafting createEvent()
            // async function createEvent(title: string, description: string, location: string, timeslots: Object[]) {
            //     let body = {
            //         title: title,
            //         description: description,
            //         location: location,
            //         timeslots: timeslots,
            //     }
            //     let response = await <request thing here>;
            //     return { success: response.success }
            // }

            // logic flow for createEvent in db
            // validate credentials
            // validate title, description, location
            // check for overlap with timeslots in events listed in user's event_attend
            
            // logic flow for deleteEvent in db (for a request sent from client) (note to add this button in event dashboard)
            // (client) alert dialog to confirm delete
            // validate credentials
            // ...

            // event table
            // columns: owner_email, event_id, title, desc, timeslot : "MM/DD/YYYY;NN:NN;NN:NN", 
            // rows: multiple rows, 1 per date per timeslot

            // user table 
            // columns: email, name, pwdHash
            // rows: 1 per user

            // operations on events
            // createEvent(...info)
            // deleteEvent(id)
            // getEvent(id)
            // modifyEvent(...info) i.e. availabilities, title, desc, location, timeslots(?)
            if (response.success) {
                toast.success("Event successfully created!");
                // send to homepage
                router.push('/');
            }
            else {
                toast.error("Uh oh!"); //stub
                console.log(response.error);
            }
        }
        asyncSubmit();
    }

    function onError(errors: Object) {
        toast.error("Event could not be created. Please resolve all issues and try again.");
    }

    // debug
    function verifyValues() {
        const values = getValues();
        // console.log("handling submitted values!", values);
        const result = formSchema.safeParse(values);
        if (result.success) {
            console.log("good values!");
        }
        else {
            console.log("bad values!");
            const issues = result.error.issues;
            console.log(issues);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
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
                                        <FormMessage />
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
                                        <FormMessage />
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="w-full max-w-3xl rounded-xl border border-[var(--border)] bg-[var(--secondary-background)] p-6 shadow-[var(--shadow)]">
                        <div className="flex flex-row flex-wrap justify-center items-start gap-8 min-h-0">
                            <FormField
                                control={form.control}
                                name="dates"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>When are you available?</FormLabel>
                                        <FormControl>
                                            <DateSelector dates={dates} updateFormCallback={updateDates} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div
                                className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-6 md:max-w-xl overflow-y-auto overscroll-y-contain max-h-[min(42vh,22rem)] pr-1 [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:var(--border)_var(--secondary-background)] [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-foreground/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/45 hover:[&::-webkit-scrollbar-thumb]:bg-foreground/60"
                            >
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

                                                            const allSlots = getValues("timeslots") ?? [];
                                                            const baseDate = isoDates.find((d) =>
                                                                allSlots.some((slot: { date: string }) => slot.date === d)
                                                            ) ?? isoDates[0];
                                                            let baseSlots = allSlots.filter(
                                                                (slot: { date: string }) => slot.date === baseDate,
                                                            );

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
                                                    <p className="text-xs text-foreground/60 italic" style={{ color: 'red' }}>
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
                                                                    className="flex flex-row flex-wrap items-end justify-start gap-4 rounded-lg border border-border bg-background/50 p-4"
                                                                >
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`timeslots.${index}.start`}
                                                                        render={() => (
                                                                            <FormItem>
                                                                                <FormLabel>Start</FormLabel>
                                                                                <FormControl>
                                                                                    <TimeComboBox
                                                                                        slotDate={dateIso}
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
                                                                                <FormMessage />
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
                                                                                        slotDate={dateIso}
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
                                                                                <FormMessage />
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
                                                                        className="shrink-0 self-center -mt-14"
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
                <div className="flex justify-center gap-4">
                    <Button type="button" variant="neutral" asChild>
                        <Link href="/">Cancel</Link>
                    </Button>
                    <Button type="submit">Create Event!</Button>
                </div>
            </form>
        </Form>
    )
}