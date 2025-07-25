import {
	type DocumentEventHandler,
	documentEventHandler,
} from "@sanity/functions";
import { Index } from "@upstash/vector";
import type { Course } from "../../sanity.types";

export const handler: DocumentEventHandler<Course> = documentEventHandler(
	async ({ event }) => {
		const index = new Index({
			url: process.env.UPSTASH_VECTOR_REST_URL,
			token: process.env.UPSTASH_VECTOR_REST_TOKEN,
		});

		const time = new Date().toLocaleTimeString();
		await index
			.upsert({
				id: `${event.data.title}.${event.data.difficulty}`,
				data: `${event.data.description}`,
				metadata: { id: event.data._id },
			})
			.catch((e) => console.log(e))
			.then((r) => {
				console.log(r);
				console.log(`Indexed into Upstash Vector at ${time}`);
			});

		console.log(`👋 Your Sanity Function was called at ${time}`);
	},
);
