'use client'

import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from 'react';

export function DateSelector(props) {
    // const [dates, setDates] = useState([]);
    // let dates = [];
    const update = (newDates) => {
        // setDates(dates);
        // console.log(newDates);
        props.updateFormCallback(newDates);
        // console.log("upd", dates);
    }

    useEffect(() => console.log("calendar's dates", props.dates));
    
    return (
        <Calendar
            mode="multiple"
            selected={props.dates}
            onSelect={props.updateFormCallback}
        />
    )
}