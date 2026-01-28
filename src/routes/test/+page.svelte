<script lang="ts">
	let status = $state('Not connected');
	let calendars = $state<any[]>([]);
	let events = $state<any[]>([]);
	let error = $state('');
	let selectedCalendarUrl = $state('');

	async function testConnection() {
		try {
			status = 'Connecting...';
			error = '';

			const response = await fetch('/api/calendars');

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			calendars = await response.json();
			status = `Success! Found ${calendars.length} calendar(s)`;

			// Auto-select first calendar
			if (calendars.length > 0) {
				selectedCalendarUrl = calendars[0].url;
			}
		} catch (e) {
			status = 'Failed';
			error = e instanceof Error ? e.message : 'Unknown error';
			console.error(e);
		}
	}

	async function fetchEvents() {
		if (!selectedCalendarUrl) {
			error = 'Please select a calendar first';
			return;
		}

		try {
			status = 'Fetching events...';
			error = '';

			const response = await fetch(
				`/api/events?calendarUrl=${encodeURIComponent(selectedCalendarUrl)}`
			);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			events = await response.json();
			status = `Found ${events.length} event(s)`;
		} catch (e) {
			status = 'Failed to fetch events';
			error = e instanceof Error ? e.message : 'Unknown error';
			console.error(e);
		}
	}
</script>

<div class="mx-auto max-w-2xl p-8">
	<h1 class="mb-4 text-2xl font-bold">CalDAV Connection Test</h1>

	<button
		onclick={testConnection}
		class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
	>
		Test Connection
	</button>

	<div class="mt-4 rounded border p-4">
		<p class="font-medium">Status: {status}</p>
		{#if error}
			<p class="mt-2 text-red-600">Error: {error}</p>
		{/if}
	</div>

	{#if calendars.length > 0}
		<div class="mt-4">
			<h2 class="mb-2 text-xl font-bold">Calendars Found:</h2>
			<ul class="space-y-2">
				{#each calendars as calendar}
					<li class="rounded border p-3">
						<p class="font-medium">{calendar.displayName}</p>
						<p class="text-sm text-gray-600">{calendar.url}</p>
					</li>
				{/each}
			</ul>
		</div>
		<div class="mt-4">
			<label class="mb-2 block text-sm font-medium">
				Select Calendar to Fetch Events:
				<select bind:value={selectedCalendarUrl} class="w-full rounded border px-3 py-2">
					{#each calendars as calendar}
						<option value={calendar.url}>
							{calendar.displayName}
						</option>
					{/each}
				</select>
			</label>

			<button
				onclick={fetchEvents}
				class="mt-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
			>
				Fetch Events
			</button>
		</div>
	{/if}
	{#if events.length > 0}
		<div class="mt-4">
			<h2 class="mb-2 text-xl font-bold">Events Found:</h2>
			<ul class="space-y-2">
				{#each events as event}
					<li class="rounded border p-3">
						<p class="font-medium">URL: {event.url}</p>
						<details class="mt-2">
							<summary class="cursor-pointer text-sm text-blue-600"> Show raw data </summary>
							<pre class="mt-2 overflow-x-auto rounded bg-gray-100 p-2 text-xs">
								{JSON.stringify(event, null, 2)}
							</pre>
						</details>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
