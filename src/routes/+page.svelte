<script lang="ts">
	import { Calendar, DayGrid, TimeGrid, List } from '@event-calendar/core';
	import type { ParsedEvent } from '$lib/types';
	import { convertToCalendarEvents } from '$lib/utils/eventConverter';

	// State
	let calendars = $state<any[]>([]);
	let selectedCalendarUrl = $state('');
	let events = $state<ParsedEvent[]>([]);
	let loading = $state(false);
	let error = $state('');

	// Derived state
	const calendarEvents = $derived(convertToCalendarEvents(events));

	// Load calendars on mount
	$effect(() => {
		loadCalendars();
	});

	// Load events when calendar selection changes
	$effect(() => {
		if (selectedCalendarUrl) {
			loadEvents();
		}
	});

	async function loadCalendars() {
		try {
			loading = true;
			error = '';

			const response = await fetch('/api/calendars');

			if (!response.ok) {
				throw new Error('Failed to load calendars');
			}

			calendars = await response.json();

			// Auto-select first calendar
			if (calendars.length > 0 && !selectedCalendarUrl) {
				selectedCalendarUrl = calendars[0].url;
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Unknown error';
		} finally {
			loading = false;
		}
	}

	async function loadEvents() {
		if (!selectedCalendarUrl) return;

		try {
			loading = true;
			error = '';

			const response = await fetch(
				`/api/events?calendarUrl=${encodeURIComponent(selectedCalendarUrl)}`
			);

			if (!response.ok) {
				throw new Error('Failed to load events');
			}

			events = await response.json();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Unknown error';
		} finally {
			loading = false;
		}
	}

	let options = $derived({
		view: 'timeGridWeek',
		headerToolbar: {
			start: 'prev,next today',
			center: 'title',
			end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
		},
		scrollTime: '09:00',
		events: calendarEvents,
		eventClick: (info: any) => {
			console.log('Event clicked:', info.event);
			alert(`Clicked: ${info.event.title}`);
		},
		views: {
			timeGridWeek: { pointer: true },
			resourceTimeGridWeek: {
				columnWidth: '6em',
				pointer: true
			}
		},
		nowIndicator: true,
		selectable: true
	});
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-7xl px-4 py-6">
		<div class="mb-6 flex items-center justify-between">
			<h1 class="text-2xl font-bold">Calendar</h1>

			{#if calendars.length > 1}
				<div>
					<label for="calendar-select" class="sr-only">Select Calendar</label>
					<select
						id="calendar-select"
						bind:value={selectedCalendarUrl}
						class="rounded-lg border px-3 py-2"
					>
						{#each calendars as calendar}
							<option value={calendar.url}>
								{calendar.displayName}
							</option>
						{/each}
					</select>
				</div>
			{/if}
		</div>

		{#if error}
			<div class="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
				{error}
			</div>
		{/if}

		{#if loading}
			<div class="rounded-lg bg-white p-8 text-center shadow">
				<p class="text-gray-500">Loading...</p>
			</div>
		{:else}
			<div class="ec overflow-hidden rounded-lg bg-white shadow">
				<Calendar plugins={[DayGrid, TimeGrid, List]} {options} />
			</div>
		{/if}
	</div>
</div>
