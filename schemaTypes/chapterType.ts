import { DocumentIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const chapterType = defineType({
	name: "chapter",
	title: "Chapter",
	type: "document",
	icon: DocumentIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			validation: (rule) => [
				rule.required().error("Title is required"),
				rule.min(3).warning("Title should be at least 3 characters"),
				rule
					.max(100)
					.warning(
						"Title should be under 100 characters for better readability",
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
			name: "course",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: { type: "course" } })],
			validation: (rule) => [
				rule.required().error("Course reference is required"),
				rule.max(1).error("Chapter can only belong to one course"),
			],
		}),
		defineField({
			name: "description",
			type: "text",
			rows: 3,
			validation: (rule) => [
				rule.required().error("Description is required"),
				rule.min(10).warning("Description should be at least 10 characters"),
				rule.max(300).warning("Description should be under 300 characters"),
			],
		}),
		defineField({
			name: "contents",
			type: "array",
			of: [
				defineArrayMember({
					type: "reference",
					to: [{ type: "lesson" }, { type: "quiz" }],
				}),
			],
			options: {
				sortable: true,
			},
			validation: (rule) =>
				rule.min(1).error("At least one lesson is required"),
		}),
	],
	preview: {
		select: {
			title: "title",
			course: "course.0.title",
			contents: "contents",
		},
		prepare({ title, course, contents }) {
			const lessonCount = contents ? contents.length : 0;
			return {
				title: title,
				subtitle: `${course} • ${lessonCount} lesson${lessonCount !== 1 ? "s" : ""}`,
			};
		},
	},
});
