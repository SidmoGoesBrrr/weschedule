'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";

const Button = ({ children, ...props }: any) => (
  <button
    {...props}
    className={`border px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 ${props.className || ""}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white shadow-md rounded-2xl ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export default function AvailabilityPage() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const [availability, setAvailability] = useState(
    days.reduce((acc, day) => {
      acc[day] = { start: "09:00", end: "17:00", available: true };
      return acc;
    }, {} as Record<string, { start: string; end: string; available: boolean }>)
  );

  const [groupAvailability] = useState({
    Monday: 4,
    Tuesday: 6,
    Wednesday: 5,
    Thursday: 7,
    Friday: 3,
    Saturday: 2,
    Sunday: 1,
  });

  const handleChange = (day: string, field: string, value: any) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting availability:", availability);
    alert("Availability submitted!");
  };

  return (
    <motion.div
      className="max-w-xl mx-auto mt-10 p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardContent className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Set Your Weekly Availability
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {days.map((day) => (
              <div
                key={day}
                className="flex items-center justify-between gap-4 border-b pb-3 last:border-0"
              >
                <span className="w-24 font-medium">{day}</span>
                {availability[day].available ? (
                  <>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={availability[day].start}
                        onChange={(e) => handleChange(day, "start", e.target.value)}
                        className="border rounded-md px-2 py-1 text-sm"
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={availability[day].end}
                        onChange={(e) => handleChange(day, "end", e.target.value)}
                        className="border rounded-md px-2 py-1 text-sm"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleChange(day, "available", false)}
                      className="text-xs"
                    >
                      Mark Unavailable
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => handleChange(day, "available", true)}
                    className="text-xs"
                  >
                    Set Available
                  </Button>
                )}
              </div>
            ))}

            <Button type="submit" className="w-full mt-4">
              Submit Availability
            </Button>
          </form>

          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Group Availability (Example)</h3>
            <ul className="text-sm space-y-1">
              {days.map((day) => (
                <li key={day}>
                  <span className="font-medium">{day}:</span>{" "}
                  {groupAvailability[day]} people available
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}