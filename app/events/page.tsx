'use client'

import Link from 'next/link'

import { useState } from 'react';

import { Event, getEvents } from '@/lib/serverEventUtil';

import { EventSearch } from '@/components/eventsearch';
import { EventList } from '@/components/eventlist';

export default function ViewEvents() {
    const [events, setEvents] = useState<Event[]>([]);

    const search = (dates: string[]) => {
        async function asyncSearch() {
            // let response = await getEvents("", "", "", dates);
            // let userEvents : Event[] = response.events ? response.events.map((event) => {
            //     const link = event.link ? event.link : `/availability?event_id=${event.id}`;
            //     return {
            //         ...event,
            //         link,
            //     }
            // }) : [];
            let corqEvents : Event[] = []; //stub
            // let sortedEvents = [...userEvents, ...corqEvents];
            // sortedEvents.sort();
            setEvents(corqEvents);
            console.log(corqEvents);
        }
        asyncSearch();
    }

    return (
        <div className="w-full min-h-screen flex flex-col">
            <header className="w-full border-b-2 border-border bg-background sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
                    <Link href="/" className="text-2xl font-heading text-main">
                        WeSchedule
                    </Link>
                </div>
            </header>
            <div className="py-4 px-4 flex flex-row items-center gap-4 flex-1">
                <div className="h-auto py-8 flex flex-col items-center flex-1">
                    <div className="w-full max-w-2xl h-full">
                        <EventSearch search={search} />
                    </div>
                </div>
                <div className="w-full h-full px-4">
                    <EventList events={events} />
                </div>
            </div>
        </div>
    );
}