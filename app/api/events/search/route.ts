import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Get the search parameters from the client request
        const { searchParams } = new URL(request.url);
        
        // Construct the URL to the external API
        const externalUrl = `https://stonybrook.campuslabs.com/engage/api/discovery/event/search?${searchParams.toString()}`;
        
        // Make the request from the server (no CORS issues server-to-server)
        const response = await fetch(externalUrl, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `External API returned ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Return the data to the client
        return NextResponse.json(data);
    } catch (error) {
        console.error('Event search proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        );
    }
}
