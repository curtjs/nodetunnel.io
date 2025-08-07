<script>
	import { onMount } from 'svelte';

	let relayStatus = $state('checking...');
	let isOnline = $state(false);
	let serverStats = $state(null);

	async function checkRelayStatus() {
		try {
			// Try to establish a connection to check if the server is reachable
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

			const response = await fetch('http://relay.nodetunnel.io:8080/', {
				signal: controller.signal
			});

			clearTimeout(timeoutId);

			if (response.ok) {
				serverStats = await response.json();
				relayStatus = 'relay online @ ';
				isOnline = true;
			} else {
				throw new Error('Server responded with an error');
			}
		} catch (error) {
			relayStatus = 'relay offline @ ';
			isOnline = false;
			serverStats = null;
		}
	}

	onMount(() => {
		checkRelayStatus();

		const interval = setInterval(() => {
			checkRelayStatus();
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="text-center">
		<h1 class="mb-8 font-mono text-4xl font-extrabold text-white">nodetunnel.io</h1>
		<button
			class="cursor-pointer rounded-full bg-blue-600 px-4 py-2 font-bold text-white transition-colors duration-200 hover:bg-blue-700"
		>
			Download
		</button>
		<div class="mt-2 text-xs text-gray-400">pre-0.0.1</div>
	</div>

	<div
		class="absolute bottom-1/4 left-1/2 -translate-x-1/2 transform text-center font-mono text-sm {isOnline
			? 'text-green-400'
			: 'text-red-400'}"
	>
		{relayStatus}<b>relay.nodetunnel.io:9998</b>

		{#if serverStats}
			<div class="mt-4 text-xs text-gray-300">
				<div>Rooms: {serverStats.totalRooms} | Peers: {serverStats.totalPeers}</div>
				<div>Memory: {serverStats.memoryUsageMB}MB | CPU: {serverStats.cpuUsagePercent}%</div>
				<i>running on nanode 1gb</i>
			</div>
		{/if}
	</div>
</div>
