import type { ParsedEvent } from "$lib/types";
import ICAL from "ical.js";

export function parseICalendarEvent(
	icalString: string,
	eventUrl: string,
	etag: string
): ParsedEvent[] {
	const jcalData = ICAL.parse(icalString);
	const comp = new ICAL.Component(jcalData);

	const vevents = comp.getAllSubcomponents('vevent');

	return vevents.map((vevent) => {
		const event = new ICAL.Event(vevent);

		return {
			uid: event.uid,
			summary: event.summary || '(No title)',
			description: event.description || null,
			start: event.startDate.toJSDate(),
			end: event.endDate.toJSDate(),
			isAllDay: event.startDate.isDate, // No time component = all day
			location: event.location || null,
			url: eventUrl,
			etag: etag,
		};
	});
}
