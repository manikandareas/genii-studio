import { colorInput } from "@sanity/color-input";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { markdownSchema } from "sanity-plugin-markdown";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
	name: "default",
	title: "Genii",

	projectId: "9ef009ob",
	dataset: "production",

	plugins: [structureTool(), visionTool(), markdownSchema(), colorInput()],

	schema: {
		types: schemaTypes,
	},
});
