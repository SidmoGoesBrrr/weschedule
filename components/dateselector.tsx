'use client'

import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from 'react';

export function DateSelector(props) {
    
    return (
        <Calendar
            mode="multiple"
            selected={props.dates}
            onSelect={props.updateFormCallback}
        />
    )
}