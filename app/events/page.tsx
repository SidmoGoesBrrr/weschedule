'use client'

import Link from 'next/link'

import { useState, useEffect } from 'react';

import { Event } from '@/lib/serverEventUtil';
import { getEvents } from '@/lib/eventFetching';

import { EventSearch } from '@/components/eventsearch';
import { EventList } from '@/components/eventlist';

const PAGE_CAPACITY = 10;

export default function ViewEvents() {
    const [eventsInfo, setEventsInfo] = useState<{
        events: Event[],
        numTotalEvents: number
    }>({
        events: [],
        numTotalEvents: 0
    });

    const [eventSearchParams, setEventSearchParams] = useState<{
        dates: string[],
        page: number,
    }>({
        dates: [],
        page: 0,
    });
    useEffect(() => {
        async function asyncSearch() {
            console.log('searching!')
            // send dates, page number, and page capacity
            // response should be success if page number within total pages
            // success response returns events and total number of events
            let dateRanges: { start: Date, end: Date }[] = [];
            eventSearchParams.dates.forEach((date) => {
                let endDate = new Date(date);
                endDate.setHours(23, 59);
                dateRanges.push({
                    start: new Date(date),
                    end: endDate,
                })
            })
            const response = await getEvents(dateRanges, eventSearchParams.page, PAGE_CAPACITY);
            if (response.success) {
                console.log(response);
                setEventsInfo({
                    events: response.events ?? [],
                    numTotalEvents: response.numEvents ?? 0,
                });
            }

        }
        asyncSearch();
    }, [eventSearchParams])

    const incrPage = () => {
        setEventSearchParams({
            ...eventSearchParams,
            page: eventSearchParams.page + 1,
        })
    }

    const decrPage = () => {
        setEventSearchParams({
            ...eventSearchParams,
            page: eventSearchParams.page - 1,
        })
    }

    const updateEventSearchParams = (newParams: { dates: string[] }) => {
        setEventSearchParams({
            ...eventSearchParams,
            ...newParams,
        })
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
                        <EventSearch updateEventSearchParams={updateEventSearchParams} />
                    </div>
                </div>
                <div className="w-full h-full px-4">
                    <EventList
                        events={eventsInfo.events}
                        page={eventSearchParams.page}
                        numEvents={eventsInfo.numTotalEvents}
                        totalPages={Math.max(1, Math.ceil(eventsInfo.numTotalEvents / PAGE_CAPACITY))}
                        incrPage={incrPage}
                        decrPage={decrPage} />
                </div>
            </div>
        </div>
    );
}