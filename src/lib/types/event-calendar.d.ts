declare module '@event-calendar/core' {
	import { SvelteComponent } from "svelte";

	export class Calendar extends SvelteComponent<any> { }
	export const DayGrid: any;
	export const TimeGrid: any;
	export const List: any;
}
