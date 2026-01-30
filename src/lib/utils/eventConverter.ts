import type { ParsedEvent } from "$lib/types";

export interface CalendarEvent {
	id: string;
	start: Date;
	end: Date;
	title: string;
	allDay: boolean;
	extendedProps: {
		description: string | null;
		location: string | null;
		url: string;
		etag: string;
	};
	color: string;
}

export function convertToCalendarEvent(event: ParsedEvent): CalendarEvent {
	return {
		id: event.uid,
		start: event.start,
		end: event.end,
		title: event.summary,
		allDay: event.isAllDay,
		extendedProps: {
			description: event.description,
			location: event.location,
			url: event.url,
			etag: event.etag,
		},
		color: "#FE6B64",
	};
}

export function convertToCalendarEvents(events: ParsedEvent[]): CalendarEvent[] {
	return events.map(convertToCalendarEvent);
}
