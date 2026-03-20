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
import { Textarea } from "@/components/ui/textarea";

import { TimeComboBox } from "@/components/timecombobox";
import { DateSelector } from "@/components/dateselector";

const errorMsgs = {
    NO_TITLE: "Event title is required.",
    TITLE_TOO_LONG: "Title is too long: maximum length is 50 characters.",
    DESC_TOO_LONG: "Description too long: maximum length is 1000 characters.",
    NO_DATES: "Please choose a date(s) for your event.",
    NO_START_TIME: "Please choose a start time.",
    NO_END_TIME: "Please choose an end time.",
}

const formSchema = z.object({
    title: z.string().min(1, errorMsgs.NO_TITLE).max(50, errorMsgs.TITLE_TOO_LONG),
    description: z.string().min(0).max(1000, errorMsgs.DESC_TOO_LONG),
    dates: z.array(z.iso.date()).min(1, errorMsgs.NO_DATES),
    timestart: z.iso.time(errorMsgs.NO_START_TIME),
    timeend: z.iso.time(errorMsgs.NO_END_TIME),
});

export function EventCreatorForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            dates: [],
            timestart: "",
            timeend: ""
        },
    });

    const { setValue, getValues } = form;
    const [state, setState] = useState({
        earliestTime: '',
        latestTime: '',
        errors: [],
    })
    useEffect(() => {
        console.log('new errors: ', state.errors);
    })
    // console.log(errors);
    const updateTimestart = (newTime: any) => {
        console.log("clearing start time selector errors!");
        let newErrors = state.errors.filter((error) => error != errorMsgs.NO_START_TIME);
        setState({
            ...state,
            earliestTime: newTime,
            errors: newErrors,
        })
        setValue("timestart", newTime);
    };
    const updateTimeend = (newTime: any) => {
        console.log("clearing end time selector errors!");
        let newErrors = state.errors.filter((error) => error != errorMsgs.NO_END_TIME);
        setState({
            ...state,
            latestTime: newTime,
            errors: newErrors,
        })
        setValue("timeend", newTime);
    }
    const watchedDates = form.watch("dates") ?? [];
    const dates = watchedDates.map((d) => new Date(d + "T00:00:00")); // parse as local

    const updateDates = (newDates: Date[]) => {
        console.log("clearing date selector errors!");
        let newErrors = state.errors.filter((error) => error != errorMsgs.NO_DATES);
        setState({
            ...state,
            errors: newErrors,
        })
        const isoStrings = newDates.map((d) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
        });
        setValue("dates", isoStrings, { shouldValidate: true });
    };

    function handleSubmit() {
        const values = getValues();
        // console.log("handling submitted values!", values);
        const result = formSchema.safeParse(values);
        if (result.success) {
            console.log("good values!");
        }
        else {
            console.log("bad values!");
            const issues = result.error.issues;
            setState({
                ...state,
                errors: issues.map(error => error.message),
            })
            console.log(issues);
        }
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        // only called when schema matches
        // console.log(values);
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
                            <FormControl
                                onChange={() => {
                                    console.log("clearing title field errors!");
                                    let newErrors = state.errors.filter((error) => error != errorMsgs.TITLE_TOO_LONG && error != errorMsgs.NO_TITLE);
                                    setState({
                                        ...state,
                                        errors: newErrors,
                                    })
                                }}>
                                <Input placeholder="Untitled" {...field} />
                            </FormControl>
                            <FormDescription className='error'>
                                {state.errors.includes(errorMsgs.TITLE_TOO_LONG) ? errorMsgs.TITLE_TOO_LONG : ""}
                                {state.errors.includes(errorMsgs.NO_TITLE) ? errorMsgs.NO_TITLE : ""}
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Description</FormLabel>
                            <FormControl
                                onChange={() => {
                                    console.log("clearing description field errors!");
                                    let newErrors = state.errors.filter((error) => error != errorMsgs.DESC_TOO_LONG);
                                    setState({
                                        ...state,
                                        errors: newErrors,
                                    })
                                }}>
                                <Textarea
                                    placeholder="A cool event!" {...field} />
                            </FormControl>
                            <FormDescription className='error'>
                                {state.errors.includes(errorMsgs.DESC_TOO_LONG) ? errorMsgs.DESC_TOO_LONG : ""}
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <div className='flex flex-row m-8'>
                    <FormField
                        control={form.control}
                        name="dates"
                        render={() => (
                            <FormItem>
                                <FormLabel>Choose Available Dates</FormLabel>
                                <FormControl>
                                    <DateSelector
                                        dates={dates}
                                        updateFormCallback={updateDates} />
                                </FormControl>
                                <FormDescription className='error'>
                                    {state.errors.includes(errorMsgs.NO_DATES) ? errorMsgs.NO_DATES : ""}
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <div className='m-8'>
                        <FormField
                            control={form.control}
                            name="timestart"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <FormControl>
                                        <TimeComboBox
                                            latest={state.latestTime}
                                            updateFormCallback={updateTimestart} />
                                    </FormControl>
                                    <FormDescription className='error'>
                                        {state.errors.includes(errorMsgs.NO_START_TIME) ? errorMsgs.NO_START_TIME : ""}
                                    </FormDescription>
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
                                        <TimeComboBox earliest={state.earliestTime} updateFormCallback={updateTimeend} />
                                    </FormControl>
                                    <FormDescription className='error'>
                                        {state.errors.includes(errorMsgs.NO_END_TIME) ? errorMsgs.NO_END_TIME : ""}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit" onClick={handleSubmit}>Submit</Button>
            </form>
        </Form>
    )
}