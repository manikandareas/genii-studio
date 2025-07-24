import { CheckmarkCircleIcon, TokenIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const enrollmentType = defineType({
	name: "enrollment",
	title: "Enrollment",
	type: "document",
	icon: TokenIcon,
	groups: [
		{
			name: "enrollment",
			title: "Enrollment",
			icon: CheckmarkCircleIcon,
			default: true,
		},
		{
			name: "progress",
			title: "Progress",
			icon: CheckmarkCircleIcon,
		},
	],
	fields: [
		defineField({
			name: "userEnrolled",
			type: "array",
			group: "enrollment",
			of: [defineArrayMember({ type: "reference", to: { type: "user" } })],
			validation: (rule) => [
				rule.required().error("User reference is required"),
				rule.max(1).error("Enrollment can only have one user"),
			],
		}),
		defineField({
			name: "course",
			type: "array",
			group: "enrollment",
			of: [defineArrayMember({ type: "reference", to: { type: "course" } })],
			validation: (rule) => [
				rule.required().error("Course reference is required"),
				rule.max(1).error("Enrollment can only have one course"),
			],
		}),
		defineField({
			name: "contentsCompleted",
			type: "array",
			group: "progress",
			of: [defineArrayMember({ type: "reference", to: { type: "lesson" } })],
			description: "Lessons that have been completed by the user",
		}),
		defineField({
			name: "dateCompleted",
			type: "datetime",
			group: "progress",
			description: "Date when the course was completed (if applicable)",
		}),
		defineField({
			name: "percentComplete",
			type: "number",
			group: "progress",
			description: "Completion percentage (0-100)",
			validation: (rule) => [
				rule.min(0).error("Percentage cannot be negative"),
				rule.max(100).error("Percentage cannot exceed 100"),
				rule.integer().error("Percentage must be a whole number"),
			],
			initialValue: 0,
		}),
	],
	preview: {
		select: {
			user: "userEnrolled.0.username",
			course: "course.0.title",
			percent: "percentComplete",
			completed: "dateCompleted",
		},
		prepare({ user, course, percent, completed }) {
			const status = completed ? "Completed" : `${percent || 0}% Complete`;
			return {
				title: `${user} - ${course}`,
				subtitle: status,
			};
		},
	},
});
