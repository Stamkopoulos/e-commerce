"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";

export default function DatePicker({ date, setDate }) {
  const presets = [
    { label: "Last 7 days", value: 7 },
    { label: "Last 30 days", value: 30 },
    { label: "Last 90 days", value: 90 },
  ];

  const handlePreset = (days) => {
    const end = new Date();
    const from = addDays(end, -days);
    setDate({ from, to: end });
    //setPreset(days);
  };

  return (
    <div className="md:space-y-0 flex items-end space-x-4 ">
      <div className="flex space-x-2">
        {presets.map((p) => (
          <Button
            key={p.value}
            size="sm"
            variant="outline"
            onClick={() => handlePreset(p.value)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <Field className="mx-auto w-60">
        <FieldLabel htmlFor="date-picker-range">Select Date Range</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker-range"
              className="justify-start px-2.5 font-normal"
            >
              <CalendarIcon />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </Field>
    </div>
  );
}
