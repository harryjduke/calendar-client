export interface ParsedEvent {
	uid: string;
	summary: string;
	description: string | null;
	start: Date;
	end: Date;
	isAllDay: boolean
	location: string | null
	url: string;
	etag: string;
}
