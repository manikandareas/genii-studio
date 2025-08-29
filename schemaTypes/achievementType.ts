import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const achievementType = defineType({
	name: "achievement",
	title: "Achievement",
	type: "document",
	icon: StarIcon,
	fields: [
		defineField({
			name: "id",
			title: "Achievement ID",
			type: "string",
			description: "Stable identifier used by the app",
			validation: (rule) => rule.required().error("ID is required"),
		}),
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (rule) => [
				rule.required().error("Title is required"),
				rule.max(50).warning("Keep titles under 50 characters"),
			],
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
			rows: 3,
			validation: (rule) => [
				rule.required().error("Description is required"),
				rule.max(200).warning("Keep descriptions under 200 characters"),
			],
		}),
		defineField({
			name: "icon",
			title: "Icon (Emoji)",
			type: "string",
			description: "Small emoji like 🎯, 🥇, 🔥",
			validation: (rule) => [
				rule.required().error("Icon is required"),
				rule.max(5),
			],
		}),
		defineField({
			name: "category",
			title: "Category",
			type: "string",
			options: {
				list: [
					{ title: "First Steps", value: "first_steps" },
					{ title: "Learning Streak", value: "streak" },
					{ title: "Quiz Performance", value: "quiz" },
					{ title: "Course Completion", value: "course" },
					{ title: "Social Learning", value: "social" },
				],
				layout: "radio",
			},
		}),
		defineField({
			name: "criteria",
			title: "Achievement Criteria",
			type: "object",
			options: { collapsible: true, collapsed: false },
			fields: [
				defineField({
					name: "type",
					title: "Criteria Type",
					type: "string",
					options: {
						list: [
							{ title: "Lesson Count", value: "lesson_count" },
							{ title: "Quiz Score", value: "quiz_score" },
							{ title: "Course Completion", value: "course_completion" },
							{ title: "Streak Days", value: "streak_days" },
							{ title: "Custom", value: "custom" },
						],
						layout: "radio",
					},
				}),
				defineField({
					name: "target",
					title: "Target Value",
					type: "number",
				}),
				defineField({
					name: "threshold",
					title: "Threshold (for percentages)",
					type: "number",
					description: "Use for percentage-based goals (e.g. score %)",
				}),
			],
		}),
		defineField({
			name: "points",
			title: "XP Points",
			type: "number",
			validation: (rule) => rule.min(0),
		}),
		defineField({
			name: "isActive",
			title: "Is Active",
			type: "boolean",
			initialValue: true,
		}),
	],
	preview: {
		select: { title: "title", subtitle: "category" },
		prepare({ title, subtitle }) {
			return { title, subtitle };
		},
	},
});

