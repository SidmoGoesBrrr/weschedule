'use client'

import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from 'react';

export function DateSelector(props) {
    const [dates, setDates] = useState([]);
    const update = (newDates) => {
        props.updateFormCallback(newDates);
        setDates(dates);
    }
    
    return (
        <Calendar
            mode="multiple"
            selected={dates}
            onSelect={update}
        />
    )
}