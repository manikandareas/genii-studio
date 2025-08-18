import { colorInput } from "@sanity/color-input";
import { visionTool } from "@sanity/vision";
import { defineConfig, useClient } from "sanity";
import { structureTool } from "sanity/structure";
import { markdownSchema } from "sanity-plugin-markdown";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
	name: "default",
	title: "Genii",

	projectId: "9ef009ob",
	dataset: "production",

	plugins: [structureTool(), visionTool(), markdownSchema(), colorInput()],
	document: {
		actions: (prev, ctx) =>
			ctx.schemaType === "chatSession"
				? [
						...prev,
						(props) => {
							const client = useClient({ apiVersion: "2025-07-01" });
							return {
								label: "Delete session + messages",
								tone: "critical",
								onHandle: async () => {
									const sessionId = props.id;
									const msgIds: string[] = await client.fetch(
										`*[_type=="chatMessage" && $id in sessions[]._ref][]._id`,
										{ id: sessionId },
									);
									const tx = client.transaction();
									msgIds.forEach((id) => tx.delete(id));
									tx.delete(sessionId);
									await tx.commit({ visibility: "async" });
									props.onComplete();
								},
							};
						},
					]
				: prev,
	},
	schema: {
		types: schemaTypes,
	},
});
