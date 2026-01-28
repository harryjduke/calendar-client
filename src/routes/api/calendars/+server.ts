import { json } from "@sveltejs/kit";
import { CalDAVClient } from "$lib/server/caldav";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
	try {
		const client = new CalDAVClient();
		await client.connect();
		const calendars = await client.fetchCalendars();

		return json(calendars);
	} catch (error) {
		console.error('CalDAV error:', error);
		return json(
			{ error: 'Failed to fetch calendars' },
			{ status: 500 }
		);
	}
};
