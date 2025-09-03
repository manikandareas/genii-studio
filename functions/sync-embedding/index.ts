import { Firecrawl } from "@mendable/firecrawl-js";
import { createClient } from "@sanity/client";
import {
	type DocumentEventHandler,
	documentEventHandler,
} from "@sanity/functions";
import { Index } from "@upstash/vector";
import { createHash } from "crypto";

type Resource = { label?: string; url: string };

// Narrowed event payload shapes we use
type CourseData = {
	resources?: Resource[];
	resourcesDigest?: string;
	title: string;
	difficulty: string;
	description: string;
	_id: string;
};

type LessonLikeData = {
	_id: string;
	title: string;
	slug?: { current?: string };
	content?: string;
};

// Minimal shape expected by Upstash Vector upsert
type UpstashVectorItem = {
	id: string;
	data: string;
	metadata?: Record<string, unknown>;
};

export const handler: DocumentEventHandler = documentEventHandler(
	async ({ event, context }) => {
		const index = new Index({
			url: process.env.UPSTASH_VECTOR_REST_URL as string,
			token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
		});

		const startTime = new Date().toLocaleTimeString();
		console.log(`👋 Your Sanity Function was started at ${startTime}`);

		switch (event.data._type) {
			case "course": {
				const data = event.data as CourseData;
				const resources = Array.isArray(data.resources) ? data.resources : [];
				// Normalize resources deterministically
				const { normalized, digest } = normalizedAndDigest(resources);
				const prevDigest = data.resourcesDigest;

				if (digest !== prevDigest) {
					console.log("resources changed, scraping...");
					await crawlAndIndexResources(normalized, startTime);
					await updateResourcesDigest(context, data._id, digest);
				}

				await upsertWithLog(
					index,
					{
						id: `${data.title}.${data.difficulty}`,
						data: `${data.description}`,
						metadata: { id: data._id, type: "course" },
					},
					`Indexed course into Upstash Vector at ${startTime}`,
				);
				break;
			}
			default: {
				const data = event.data as LessonLikeData;
				if (!data.content) return;
				const chunks = splitContent(data.content);
				const body = chunks.map((c) => ({
					id: `${data.title}.${data.slug?.current}.${c.index}`,
					data: c.text,
					metadata: {
						id: data._id,
						type: "lesson",
						chunkIndex: c.index,
					},
				}));

				await upsertWithLog(
					index,
					body,
					`Indexed lesson into Upstash Vector at ${startTime}`,
				);
			}
		}

		console.log(
			`👋 Your Sanity Function was ended at ${new Date().toLocaleTimeString()}`,
		);
	},
);

/**
 * Deterministically normalize resources and compute a digest for change detection.
 */
export function normalizedAndDigest(resources: Resource[]) {
	const normalized: { label: string; url: string }[] = resources
		.filter((r) => r?.url)
		.map((r) => ({ label: r.label ?? "", url: r.url }))
		.sort((a, b) =>
			(a.url + "|" + a.label).localeCompare(b.url + "|" + b.label),
		);
	const json = JSON.stringify(normalized);
	const digest = createHash("sha256").update(json).digest("hex");
	return { normalized, digest };
}

/**
 * Scrape resource URLs and index their content chunks into the resource store.
 */
async function crawlAndIndexResources(
	normalized: { label: string; url: string }[],
	time: string,
	limit: number = 5,
) {
	const firecrawl = new Firecrawl({
		apiKey: process.env.FIRECRAWL_API_KEY,
	});

	const resourceIndex = new Index({
		url: process.env.UPSTASH_VECTOR_RESOURCE_STORE_REST_URL as string,
		token: process.env.UPSTASH_VECTOR_RESOURCE_STORE_REST_TOKEN as string,
	});

	for (const r of normalized) {
		console.log(`Scrape placeholder: ${r.url} (${r.label})`);
		const crawlResponse = await firecrawl.crawl(r.url, {
			limit,
			scrapeOptions: {
				formats: ["markdown"],
			},
		});

		for (const c of crawlResponse.data) {
			const chunks = splitContent(c.markdown as string);
			const body = chunks.map((c) => ({
				id: `${r.label}.${c.index}`,
				data: c.text,
				metadata: {
					url: r.url,
					chunkIndex: c.index,
				},
			}));

			await resourceIndex
				.upsert(body)
				.catch((e) => console.log(e))
				.then((r) => {
					console.log(r);
					console.log(`Indexed resource into Upstash Vector at ${time}`);
				});
		}
	}
}

/**
 * Patch the current document with the computed resourcesDigest.
 */
async function updateResourcesDigest(
	context: { clientOptions: Record<string, unknown> },
	documentId: string,
	digest: string,
) {
	const token = process.env.SANITY_EDITOR_TOKEN;
	if (!token) {
		console.warn(
			"Missing SANITY_EDITOR_TOKEN; skipping resourcesDigest patch.",
		);
		return;
	}

	const sanityClient = createClient({
		...context.clientOptions,
		token,
		apiVersion: "2025-05-08",
		useCdn: false,
	});

	await sanityClient
		.patch(documentId)
		.set({ resourcesDigest: digest })
		.commit({ visibility: "async" })
		.catch((e: unknown) => console.log(e));
}

/**
 * Helper to upsert into Upstash Vector with consistent logging.
 */
async function upsertWithLog(
	index: Index,
	payload: UpstashVectorItem | UpstashVectorItem[],
	successMessage: string,
) {
	await index
		.upsert(payload)
		.catch((e) => console.log(e))
		.then((r) => {
			console.log(r);
			console.log(successMessage);
		});
}

export function splitContent(content: string, chunkSize = 500) {
	const sentences = content.split(". ");
	const chunks: { text: string; index: number }[] = [];
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
