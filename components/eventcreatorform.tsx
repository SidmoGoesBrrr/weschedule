'use client';

import { useState, useEffect } from 'react';

import { z } from 'zod';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";

import { TimeComboBox } from "@/components/timecombobox";

const formSchema = z.object({
    title: z.string().min(1).max(50),
    // description: z.string().min(0).max(1000),
    dates: z.array(z.iso.date()),
    timestart: z.iso.time(),
    timeend: z.iso.time()
});

export function EventCreatorForm() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "Untitled",
            // description: "",
            dates: [new Date().toISOString().splice(0, 10)],
            timestart: "00:00",
            timeend: "00:00"
        },
    });

    const { setValue } = form;
    const updateTimestart = (newTime) => setValue("timestart", newTime);
    const updateTimeend = (newTime) => setValue("timeend", newTime);
    const updateDates = (newDates) => setValue("dates", newDates);

    function onSubmit(values: z.infer<typeof formSchema>) {
        // only called when schema matches
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Untitled" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dates"
                    render={() => (
                        <FormItem>
                            <FormLabel>Choose Available Dates</FormLabel>
                            <FormControl>
                                <TimeComboBox updateFormCallback={updateDates}/>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="timestart"
                    render={() => (
                        <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                                <TimeComboBox updateFormCallback={updateTimestart}/>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="timeend"
                    render={() => (
                        <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                                <TimeComboBox updateFormCallback={updateTimeend}/>
                            </FormControl>
                        </FormItem>
                    )}
                />
                {/* <Input type="hidden" name="timestart" value={values.timestart}/> */}
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}