'use client'

import Link from "next/link"

import { ChevronRight, ChevronLeft } from 'lucide-react'

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
    const components = timeslot.split(';');
    const dayTemp = new Date(components[0]);
    const startTime = components[1].split(':');
    const startTimeTemp = new Date(dayTemp);
    startTimeTemp.setHours(Number(startTime[0]), Number(startTime[1]));

    const endTime = components[2].split(':');
    const endTimeTemp = new Date(dayTemp);
    endTimeTemp.setHours(Number(endTime[0]), Number(endTime[1]));

    // const dayTemp = new Date(timeslot.slice(0, 10));
    // const startTimeTemp = new Date();
    // startTimeTemp.setHours(Number(timeslot.slice(11, 13)));
    // startTimeTemp.setMinutes(Number(timeslot.slice(14, 16)));
    // const endTimeTemp = new Date();
    // endTimeTemp.setHours(Number(timeslot.slice(17, 19)));
    // endTimeTemp.setMinutes(Number(timeslot.slice(20, 22)));

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

export function EventList(props: {
    events: Event[],
    incrPage: () => void,
    decrPage: () => void,
    page: number,
    numEvents: number,
    totalPages: number,
}) {
    let eventCards = props.events.map((event) => {
        // console.log(event);
        return (
            <Card key={event.id} className="w-full p-4 mb-4 flex flex-col gap-3">
                <CardHeader className="p-0">
                    <CardTitle className="text-lg">
                        {event.title}
                    </CardTitle>
                </CardHeader>
                <CardDescription className="px-0">
                    <div dangerouslySetInnerHTML={{__html: event.description}}/>
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
                    <Link target='_blank' href={event.link}>
                        <Button>
                            Go to Event
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        )
    });



    return (<Card className="flex-1 p-4 bg-[var(--secondary-background)] h-[min(75vh,100rem)]">
        <div className='flex-row m-1'>
            <Button className="mr-2 mb-2" disabled={props.page + 1 <= 1} onClick={props.decrPage}>
                <ChevronLeft />
            </Button>
            <Button disabled={props.page + 1 >= props.totalPages} onClick={props.incrPage}>
                <ChevronRight />
            </Button>
            <CardTitle>
                {`Page ${props.page + 1}/${props.totalPages} (${props.numEvents} total results)`}
            </CardTitle>
        </div>
        <div className="m-1 overflow-y-auto overscroll-y-contain  [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:var(--border)_var(--secondary-background)] [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-foreground/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/45 hover:[&::-webkit-scrollbar-thumb]:bg-foreground/60">
            {eventCards.length == 0 ? "No events for the selected dates!" : eventCards}
        </div>
    </Card>)
}