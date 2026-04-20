import axios, { AxiosResponse } from "axios";

export type DateRange = {
    start: Date;
    end: Date;
}

export type Event = {
    event_id: number;
    event_creator: string;
    title: string;
    desc: string;
    location: string;
    timeslots: [string];
}

const EVENT_RETURN_LIMIT: number = 10; // Change this later

// Reuse to avoid creating a new object for each event
const dateFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
});

export async function getEvents(availability: DateRange[]): Promise<Event[]> {
    const events: Event[] = [];

    // Collect all promises for fetching events for each time range in availability
    const requests: Promise<AxiosResponse>[] = [];
    availability.forEach((range: DateRange) => {
        requests.push(axios.get<AxiosResponse>(`https://stonybrook.campuslabs.com/engage/api/discovery/event/search?startsAfter=${range.start.toISOString().replaceAll(":", "%3A")}&endsBefore=${range.end.toISOString().replaceAll(":", "%3A")}&orderByField=startsOn&orderByDirection=ascending&status=Approved&take=${EVENT_RETURN_LIMIT}`));
    });
    
    // Collate the returned events
    await Promise.all(requests).then((responses: AxiosResponse[]) => {
        responses.forEach((response: AxiosResponse) => { // Iterate over the responses corresponding to the DateRanges in availability
            response.data.value.forEach((eventData: {name: string, description: string, location: string, startsOn: string, endsOn: string}) => { // For each event in the response
                if (events.length < EVENT_RETURN_LIMIT) {
                    let start: Date = new Date(eventData.startsOn);
                    let end: Date = new Date(eventData.endsOn);
                    let event: Event = {
                        event_id: -1,
                        event_creator: "",
                        title: eventData.name,
                        desc: eventData.description,
                        location: eventData.location,
                        timeslots: [`${start.toLocaleDateString()};${dateFormatter.format(start)};${dateFormatter.format(end)}`]
                    };

                    events.push(event);
                }
            });
        })
    });

    return events;
}