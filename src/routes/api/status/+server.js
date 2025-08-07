export async function GET() {
	try {
		const res = await fetch('http://relay.nodetunnel.io:8080/');
		const data = await res.json();

		return new Response(JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to fetch server status' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	}
}
