import { SparklesIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const recommendationType = defineType({
	name: "recommendation",
	title: "Recommendation",
	type: "document",
	icon: SparklesIcon,
	fields: [
		defineField({
			name: "query",
			title: "Search Query",
			type: "string",
			description:
				"The original search query that generated these recommendations",
			validation: (Rule) => Rule.required().error("A search query is required"),
		}),
		defineField({
			name: "reason",
			title: "Reason for Recommendation",
			type: "text",
			description: "Optional explanation of why these courses were recommended",
			rows: 3,
		}),
		defineField({
			name: "createdFor",
			title: "Recommended For",
			type: "reference",
			to: [{ type: "user" }],
			description: "The user who received these recommendations",
			validation: (Rule) =>
				Rule.required().error(
					"Must specify which user these recommendations are for",
				),
		}),
		defineField({
			name: "courses",
			title: "Recommended Courses",
			type: "array",
			of: [
				{
					type: "reference",
					to: [{ type: "course" }],
				},
			],
			description: "Courses recommended for the user",
			validation: (Rule) =>
				Rule.required().min(1).error("At least one course must be recommended"),
		}),
	],
	preview: {
		select: {
			title: "query",
			user: "createdFor.name",
			count: "courses.length",
		},
		prepare(selection) {
			const { title, user, count } = selection;
			return {
				title: title || "Untitled",
				subtitle: `For: ${user || "Unknown user"} • ${count || 0} courses`,
			};
		},
	},
});
