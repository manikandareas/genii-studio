import { BookIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const lessonType = defineType({
	name: "lesson",
	title: "Lesson",
	type: "document",
	icon: BookIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			validation: (rule) => [
				rule.required().error("Title is required"),
				rule.min(3).warning("Title should be at least 3 characters"),
				rule
					.max(120)
					.warning(
						"Title should be under 120 characters for better readability",
					),
			],
		}),
		defineField({
			name: "slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: 96,
			},
			validation: (rule) =>
				rule.required().error("Slug is required for URL generation"),
		}),
		defineField({
			name: "chapter",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: { type: "chapter" } })],
			validation: (rule) => [
				rule.required().error("Chapter reference is required"),
				rule.max(1).error("Lesson can only belong to one chapter"),
			],
		}),
		defineField({
			name: "content",
			type: "markdown",
			description: "Lesson content in markdown format",
			validation: (rule) => rule.required().error("Content is required"),
		}),
		defineField({
			name: "videoUrl",
			title: "Video URL",
			type: "url",
			description:
				"Optional video URL for this lesson (YouTube, Vimeo, etc.)",
			validation: (rule) =>
				rule
					.uri({ scheme: ["http", "https"] })
					.warning("Use a valid URL starting with http or https"),
		}),
	],
	preview: {
		select: {
			title: "title",
			chapter: "chapter.0.title",
		},
		prepare({ title, chapter }) {
			return {
				title: title,
				subtitle: chapter ? `Chapter: ${chapter}` : "No chapter assigned",
			};
		},
	},
});
