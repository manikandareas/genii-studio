import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const aiArtifactType = defineType({
	name: "aiArtifact",
	title: "AI Artifact",
	type: "document",
	icon: DocumentIcon,
	fields: [
		defineField({
			name: "userId",
			type: "string",
			validation: (rule) => rule.required().error("User ID is required"),
		}),
		defineField({
			name: "lesson",
			type: "reference",
			to: [{ type: "lesson" }],
			validation: (rule) =>
				rule.required().error("Lesson reference is required"),
		}),
		defineField({
			name: "sectionKey",
			type: "string",
			description: "Optional anchor for specific section within the lesson",
		}),
		defineField({
			name: "type",
			type: "string",
			initialValue: "explainer",
			options: {
				list: [
					{ title: "Explainer", value: "explainer" },
					{ title: "Summary", value: "summary" },
					{ title: "Example", value: "example" },
					{ title: "Exercise", value: "exercise" },
				],
				layout: "radio",
			},
			validation: (rule) => rule.required().error("Type is required"),
		}),
		defineField({
			name: "text",
			type: "text",
			title: "AI Response",
			description: "AI-generated content in plain markdown/text format",
			validation: (rule) =>
				rule.required().error("AI response text is required"),
		}),
	],
	preview: {
		select: {
			title: "type",
			subtitle: "lesson.title",
			userId: "userId",
		},
		prepare({ title, subtitle, userId }) {
			return {
				title: `${title} artifact`,
				subtitle: `${subtitle} - User: ${userId}`,
			};
		},
	},
});
