'use client'

import { Event } from '@/lib/serverEventUtil';

export function EventList(props: { events: Event[] }) {
    let eventCards = props.events.map((event) => {
        console.log(event);
        return (
            <div key={event.id} className="w-full max-w-3xl rounded-xl border border-[var(--border)] bg-[var(--secondary-background)] p-6 shadow-[var(--shadow)]">
                <div className="flex flex-row flex-wrap justify-center items-start gap-8 min-h-0">
                    {event.title}
                    {event.description}
                    {event.location}
                    {event.timeslots.reduce((acc, curr) => {
                        return acc + " " + curr;
                    })}
                </div>
            </div>
        )
    }
    );



    return (<div>
        {eventCards}
    </div>)
}