<script lang="ts">
	let status = $state('Not connected');
	let calendars = $state<any[]>([]);
	let error = $state('');

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
		} catch (e) {
			status = 'Failed';
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
	{/if}
</div>
