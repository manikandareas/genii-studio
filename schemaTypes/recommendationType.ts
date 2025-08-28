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
		defineField({
			name: "status",
			title: "Status",
			type: "string",
			description: "Processing state of this recommendation request",
			options: {
				list: [
					{ title: "In Progress", value: "in_progress" },
					{ title: "Completed", value: "completed" },
					{ title: "Failed", value: "failed" },
				],
				layout: "radio",
			},
			initialValue: "in_progress",
			validation: (Rule) => Rule.required().error("Status is required"),
		}),
		defineField({
			name: "message",
			title: "Message",
			type: "text",
			description:
				"Optional notes or error details when the recommendation process fails",
			rows: 3,
			validation: (Rule) =>
				Rule.max(500).warning("Keep the message under 500 characters"),
		}),
	],
	preview: {
		select: {
			title: "query",
			user: "createdFor.name",
			count: "courses.length",
			status: "status",
		},
		prepare(selection) {
			const { title, user, count, status } = selection;
			return {
				title: title || "Untitled",
				subtitle: `For: ${user || "Unknown user"} • ${count || 0} courses • ${status || "in_progress"}`,
			};
		},
	},
});
