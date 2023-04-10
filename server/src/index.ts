export interface Env {
	UPLOADS: R2Bucket;
}

export default {
	async fetch(
		request: Request,
		env: Env,
	): Promise<Response> {
		if (request.method !== "POST") {
			return new Response("Invalid method", { status: 405 });
		}
		try {
			await env.UPLOADS.put("test", await request.text());
		} catch (e: any) {
			console.log(e.message);
			return new Response(e.message, { status: 500 });
		}
		return new Response("Success!");
	},
};
