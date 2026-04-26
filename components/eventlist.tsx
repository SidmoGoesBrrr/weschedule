'use client'

import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from '@/components/ui/label'


import { Event } from '@/lib/serverEventUtil';

function timeslotToString(timeslot: string) {
    // assumed format is "MM-DD-YYYY;HH:MM;HH:MM"
    const dayTemp = new Date(timeslot.slice(0, 10));
    const startTimeTemp = new Date();
    startTimeTemp.setHours(Number(timeslot.slice(11, 13)));
    startTimeTemp.setMinutes(Number(timeslot.slice(14, 16)));
    const endTimeTemp = new Date();
    endTimeTemp.setHours(Number(timeslot.slice(17, 19)));
    endTimeTemp.setMinutes(Number(timeslot.slice(20, 22)));

    const dayString = dayTemp.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    })
    const startTimeString = startTimeTemp.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    })
    const endTimeString = endTimeTemp.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    })
    return dayString + " | " + startTimeString + " to " + endTimeString;

}

export function EventList(props: { events: Event[] }) {
    let eventCards = props.events.map((event) => {
        console.log(event);
        return (
            <Card key={event.id} className="w-full p-4 mb-4 flex flex-col gap-3">
                <CardHeader className="p-0">
                    <CardTitle className="text-lg">
                        {event.title}
                    </CardTitle>
                </CardHeader>
                <CardDescription className="px-0">
                    {event.description}
                </CardDescription>
                <CardContent className="p-0 space-y-2">
                    {event.location ? (
                        <div>
                            <Label>Location</Label>
                            <p className="text-sm">{event.location}</p>
                        </div>
                    ) : ""}
                    <div>
                        <Label>Dates/Times</Label>
                        {event.timeslots.map((timeslot) => {
                            return (
                                <p key={timeslot} className="text-sm">
                                    {timeslotToString(timeslot)}
                                </p>
                            );
                        })}
                    </div>
                </CardContent>
                <CardFooter className="p-0">
                    <Link href={event.link}>
                        <Button>
                            Register
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        )
    });



    return (<Card className="flex-1 p-4 bg-[var(--secondary-background)] overflow-y-auto overscroll-y-contain h-[min(75vh,100rem)] [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:var(--border)_var(--secondary-background)] [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-foreground/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/45 hover:[&::-webkit-scrollbar-thumb]:bg-foreground/60">
        {eventCards.length == 0 ? "No events for the selected dates!" : eventCards}
    </Card>)
}