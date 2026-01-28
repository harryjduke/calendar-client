import { DAVClient, type DAVCalendar, type DAVCalendarObject } from "tsdav";
import { CALDAV_SERVER_URL, CALDAV_USERNAME, CALDAV_PASSWORD } from "$env/static/private";
import { parseICalendarEvent } from "./parser";
import type { ParsedEvent } from "$lib/types";

export class CalDAVClient {
	private client: DAVClient | null = null;

	async connect(): Promise<void> {
		this.client = new DAVClient({
			serverUrl: CALDAV_SERVER_URL,
			credentials: {
				username: CALDAV_USERNAME,
				password: CALDAV_PASSWORD,
			},
			authMethod: 'Basic',
			defaultAccountType: 'caldav',
		});

		await this.client.login();
	}

	async fetchCalendars(): Promise<DAVCalendar[]> {
		if (!this.client) throw new Error('Not connected');
		return await this.client.fetchCalendars();
	}

	async fetchCalendarObjects(calendar: DAVCalendar): Promise<DAVCalendarObject[]> {
		if (!this.client) throw new Error('Not connected');
		return await this.client.fetchCalendarObjects({ calendar });
	}

	async fetchEvents(calendar: DAVCalendar): Promise<ParsedEvent[]> {
		const calendarObjects = await this.fetchCalendarObjects(calendar);

		const parsedEvents: ParsedEvent[] = [];

		for (const object of calendarObjects) {
			const parsedEvent = parseICalendarEvent(object.data, object.url, object.etag || '');
			parsedEvents.push(...parsedEvent);
		}

		return parsedEvents;
	}
}
