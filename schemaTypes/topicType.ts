import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const topicType = defineType({
	name: "topic",
	title: "Topic",
	type: "document",
	icon: TagIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			validation: (rule) => [
				rule.required().error("Title is required"),
				rule.min(3).warning("Title should be at least 3 characters"),
				rule
					.max(60)
					.warning(
						"Title should be under 60 characters for better readability",
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
			name: "description",
			type: "text",
			rows: 3,
			validation: (rule) => [
				rule.required().error("Description is required"),
				rule.min(10).warning("Description should be at least 10 characters"),
				rule.max(200).warning("Description should be under 200 characters"),
			],
		}),
		defineField({
			name: "icon",
			type: "string",
			description: "Icon name or emoji to represent this topic",
		}),
		defineField({
			name: "color",
			type: "color",
			description: "Color to represent this topic",
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "description",
			icon: "icon",
		},
		prepare({ title, subtitle, icon }) {
			return {
				title: title,
				subtitle: subtitle,
				media: icon ? () => icon : TagIcon,
			};
		},
	},
});
