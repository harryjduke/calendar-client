import { json } from "@sveltejs/kit";
import { CalDAVClient } from "$lib/server/caldav";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
	try {
		const calendarUrl = url.searchParams.get('calendarUrl');

		if (!calendarUrl) {
			return json(
				{ error: 'calendarUrl query parameter required' },
				{ status: 400 }
			);
		}

		const client = new CalDAVClient();
		await client.connect();

		const calendars = await client.fetchCalendars();
		const calendar = calendars.find((calendar) => calendar.url === calendarUrl);

		if (!calendar) {
			return json(
				{ error: 'Calendar not found' },
				{ status: 404 }
			);
		}

		const events = await client.fetchEvents(calendar);

		return json(events);
	} catch (error) {
		console.error('Fetch events error:', error);
		return json(
			{ error: 'Failed to fetch events', details: error instanceof Error ? error.message : 'Unknown' },
			{ status: 500 }
		);
	}
}
