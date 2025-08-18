import {
	type DocumentEventHandler,
	documentEventHandler,
} from "@sanity/functions";
import { Index } from "@upstash/vector";
import type { Course, Lesson } from "../../sanity.types";

export const handler: DocumentEventHandler<Course | Lesson> =
	documentEventHandler(async ({ event }) => {
		const index = new Index({
			url: process.env.UPSTASH_VECTOR_REST_URL,
			token: process.env.UPSTASH_VECTOR_REST_TOKEN,
		});

		const time = new Date().toLocaleTimeString();

		console.log(`👋 Your Sanity Function was started at ${time}`);

		switch (event.data._type) {
			case "course":
				await index
					.upsert({
						id: `${event.data.title}.${event.data.difficulty}`,
						data: `${event.data.description}`,
						metadata: { id: event.data._id, type: "course" },
					})
					.catch((e) => console.log(e))
					.then((r) => {
						console.log(r);
						console.log(`Indexed course into Upstash Vector at ${time}`);
					});
				break;
			default: {
				if (!event.data.content) return;
				const chunks = splitContent(event.data.content);
				const body = chunks.map((c) => ({
					id: `${event.data.title}.${event.data.slug?.current}.${c.index}`,
					data: c.text,
					metadata: {
						id: event.data._id,
						type: "lesson",
						chunkIndex: c.index,
					},
				}));
				await index
					.upsert(body)
					.catch((e) => console.log(e))
					.then((r) => {
						console.log(r);
						console.log(`Indexed lesson into Upstash Vector at ${time}`);
					});
			}
		}

		console.log(
			`👋 Your Sanity Function was ended at ${new Date().toLocaleTimeString()}`,
		);
	});

export function splitContent(content: string, chunkSize = 500) {
	const sentences = content.split(". ");
	const chunks = [];
	let currentChunk = "";
	let index = 0;

	for (const sentence of sentences) {
		if ((currentChunk + sentence).length > chunkSize && currentChunk) {
			chunks.push({ text: currentChunk.trim(), index: index++ });
			currentChunk = sentence + ". ";
		} else {
			currentChunk += sentence + ". ";
		}
	}

	if (currentChunk) {
		chunks.push({ text: currentChunk.trim(), index: index++ });
	}

	return chunks;
}
