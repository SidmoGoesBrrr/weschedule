'use client'

import { EventCreatorForm } from '@/components/eventcreatorform'

export default function EventCreator() {
    return (
        <div className="pt-15 pb-15 flex flex-col items-center">
            <div className="w-full max-w-2xl">
                <EventCreatorForm/>
            </div>
        </div>
    );
}