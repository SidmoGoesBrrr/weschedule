
import { z } from 'zod';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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

import { DateSelector } from '@/components/dateselector';

const formSchema = z.object({
    dates: z.array(z.iso.date()),
})

export function EventSearch(props: any) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dates: [],
        },
    });
    const { setValue, getValues } = form;
    const watchedDates = form.watch("dates") ?? [];
    const dates = watchedDates.map((d) => new Date(d + "T00:00:00")); // parse as local

    const updateDates = (newDates: Date[]) => {
        const isoStrings = newDates.map((d) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
        });
        setValue("dates", isoStrings, { shouldValidate: true });
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        props.search(values.dates);
    }

    function onError(errors: Object) { }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
                <div className="w-full max-w-3xl rounded-xl border border-[var(--border)] bg-[var(--secondary-background)] p-6 shadow-[var(--shadow)]">
                    <div className="flex flex-row flex-wrap justify-center items-start gap-8 min-h-0">
                        <FormField
                            control={form.control}
                            name="dates"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Select Dates</FormLabel>
                                    <FormControl>
                                        <DateSelector dates={dates} updateFormCallback={updateDates} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-center gap-4">
                        <Button type="submit">Search</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}