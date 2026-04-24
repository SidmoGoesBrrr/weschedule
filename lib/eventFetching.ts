import axios, { AxiosResponse } from "axios";

export type DateRange = {
    start: Date;
    end: Date;
}

export type CorqEvent = {
    title: string;
    desc: string;
    location: string;
    time: DateRange;
    link: string;
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

const EVENT_RETURN_LIMIT: number = 10; // Change this later

export async function getEvents(availability: DateRange[]): Promise<CorqEvent[]> {
    const events: CorqEvent[] = [];

    // Collect all promises for fetching events for each time range in availability
    const requests: Promise<AxiosResponse<SearchResponse>>[] = [];
    availability.forEach((range: DateRange) => {
        if (!isNaN(range.start.getTime()) && !isNaN(range.end.getTime()) && range.start < range.end) { // Validate the time ranges
            const searchParams = new URLSearchParams({
                startsAfter: encodeURI(range.start.toISOString()),
                endsBefore: encodeURI(range.end.toISOString()),
                orderByField: "startsOn",
                orderByDirection: "ascending",
                status: "approved",
                take: EVENT_RETURN_LIMIT.toString()
            })
            requests.push(axios.get<SearchResponse>(`https://stonybrook.campuslabs.com/engage/api/discovery/event/search?${searchParams.toString()}`, {timeout: 10000}));
        }
    });
    
    // Collate the returned events
    await Promise.allSettled(requests).then((responses: PromiseSettledResult<AxiosResponse<SearchResponse>>[]) => {
        responses.forEach((response: PromiseSettledResult<AxiosResponse<SearchResponse>>) => { // Iterate over the responses corresponding to the DateRanges in availability
            if (response.status === "fulfilled") {
                response.value.data.value.forEach((eventData: EventResponse) => { // For each event in the response
                    if (events.length < EVENT_RETURN_LIMIT) {
                        const event: CorqEvent = {
                            title: eventData.name,
                            desc: eventData.description,
                            location: eventData.location,
                            time: {start: new Date(eventData.startsOn), end: new Date(eventData.endsOn)},
                            link: `https://stonybrook.campuslabs.com/engage/event/${eventData.id}`
                        };

                        events.push(event);
                    }
                });
            }
        })
    });

    return events;
}