import axios, { AxiosResponse } from "axios";

export type DateRange = {
    start: Date,
    end: Date
}

export type CorqEvent = {
    id: string
    title: string,
    description: string,
    location: string,
    dates: string[],
    timeslots: string[],
    time: DateRange,
    link: string
}

// Represents an event returned by the SBEngaged API
type EventResponse = {
    id: string,
    name: string,
    description: string,
    location: string,
    startsOn: string,
    endsOn: string
}

type SearchResponse = {
    value: EventResponse[]
}

// const EVENT_RETURN_LIMIT: number = 10; // Change this as needed

export async function getEvents(availability: DateRange[], page: number, pageCapacity: number) {
    console.log(availability);
    if (page < 0) {
        return { success: false, error: "Negative page number -- out of bounds" }
    }
    let events: CorqEvent[] = [];

    // Collect all promises for fetching events for each time range in availability
    const requests: Promise<AxiosResponse<SearchResponse>>[] = [];
    availability.forEach((range: DateRange) => {
        // Validate the time ranges
        if (!isNaN(range.start.getTime()) && !isNaN(range.end.getTime()) && range.start < range.end) {
            const searchParams = new URLSearchParams({
                startsAfter: encodeURI(range.start.toISOString()),
                endsBefore: encodeURI(range.end.toISOString()),
                orderByField: "startsOn",
                orderByDirection: "ascending",
                status: "approved",
                // take: EVENT_RETURN_LIMIT.toString()
            });
            requests.push(axios.get<SearchResponse>(`/api/events/search?${searchParams.toString()}`,
                {
                    timeout: 10000,
                }
            ));
        }
    });

    // Collate the returned events
    await Promise.allSettled(requests).then((responses: PromiseSettledResult<AxiosResponse<SearchResponse>>[]) => {
        // Iterate over the responses corresponding to the DateRanges in availability
        responses.forEach((response: PromiseSettledResult<AxiosResponse<SearchResponse>>) => {
            // Add each event in the response to an array, up to EVENT_RETURN_LIMIT
            if (response.status === "fulfilled") {
                response.value.data.value.forEach((eventData: EventResponse) => {
                    // if (events.length < EVENT_RETURN_LIMIT) {
                    // console.log('this event starts on')
                    // console.log(eventData.startsOn)
                    // console.log('and ends on')
                    // console.log(eventData.endsOn)
                    const startDateString = eventData.startsOn.slice(0, 10);
                    const dateStartTime = new Date(eventData.startsOn).toLocaleTimeString('en-US', {
                        hour12: false,
                    })
                    const dateEndTime = new Date(eventData.endsOn).toLocaleTimeString('en-US', {
                        hour12: false,
                    })
                    const event: CorqEvent = {
                        id: eventData.id,
                        title: eventData.name,
                        description: eventData.description,
                        location: eventData.location,
                        dates: [startDateString],
                        timeslots: [`${startDateString};${dateStartTime};${dateEndTime}`], //stub
                        time: { start: new Date(eventData.startsOn), end: new Date(eventData.endsOn) },
                        link: `https://stonybrook.campuslabs.com/engage/event/${eventData.id}`
                    };

                    events.push(event);
                    // }
                });
            }
        })
    });

    const totalPages = Math.ceil(events.length / pageCapacity);
    // console.log(`${page} vs ${totalPages}`)
    const numEvents = events.length;
    if (page >= totalPages && totalPages > 0) {
        return { success: false, events: [], numEvents: 0, error: "Page out of bounds" }
    }
    events.sort((a, b) => a.dates[0].localeCompare(b.dates[0]))
    const eventsToReturn = events.slice(page * pageCapacity, Math.min(events.length, (page + 1) * pageCapacity))

    return {
        success: true,
        events: eventsToReturn,
        numEvents: numEvents,
    };
}