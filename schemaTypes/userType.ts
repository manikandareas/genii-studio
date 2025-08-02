import { UserIcon } from "@sanity/icons";

import { defineField, defineType } from "sanity";

export const userType = defineType({
	name: "user",
	title: "User",
	type: "document",
	icon: UserIcon,
	groups: [
		{
			name: "profile",
			title: "Profile",
			icon: UserIcon,
			default: true,
		},
		{
			name: "settings",
			title: "Settings",
			icon: UserIcon,
		},
		{
			name: "study",
			title: "Study",
			icon: UserIcon,
		},
	],
	fields: [
		defineField({
			name: "username",
			type: "string",
			group: "profile",
			description: "Unique username for the user",
			validation: (rule) =>
				rule.required().error("Username is required for user identification"),
		}),
		defineField({
			name: "firstname",
			type: "string",
			group: "profile",
			validation: (rule) => rule.required().error("First name is required"),
		}),
		defineField({
			name: "lastname",
			type: "string",
			group: "profile",
			validation: (rule) => rule.required().error("Last name is required"),
		}),
		defineField({
			name: "email",
			type: "string",
			group: "profile",
			validation: (rule) => [
				rule.required().error("Email is required"),
				rule.email().error("Must be a valid email address"),
			],
		}),
		defineField({
			name: "clerkId",
			type: "string",
			group: "settings",
			description: "Clerk authentication ID",
			validation: (rule) =>
				rule.required().error("Clerk ID is required for authentication"),
		}),
		defineField({
			name: "onboardingStatus",
			type: "string",
			group: "settings",
			options: {
				list: [
					{ title: "Not Started", value: "not_started" },
					{ title: "Completed", value: "completed" },
				],
				layout: "radio",
			},
			initialValue: "not_started",
		}),
		defineField({
			name: "learningGoals",
			type: "array",
			group: "study",
			of: [{ type: "string" }],
		}),
		defineField({
			name: "studyReason",
			type: "string",
			group: "study",
		}),
		defineField({
			name: "studyPlan",
			type: "string",
			group: "study",
		}),
		defineField({
			name: "level",
			type: "string",
			group: "study",
			options: {
				list: [
					{ title: "Beginner", value: "beginner" },
					{ title: "Intermediate", value: "intermediate" },
					{ title: "Advanced", value: "advanced" },
				],
				layout: "radio",
			},
		}),
		defineField({
			name: "studyStreak",
			type: "number",
			group: "study",
			description: "Consecutive days of study",
		}),
		defineField({
			name: "streakStartDate",
			type: "number",
			group: "study",
			description: "Timestamp when the current streak started",
		}),
		defineField({
			name: "delivery_preference",
			type: "string",
			group: "study",
			description:
				"Learning delivery preference, e.g., 'storytelling', 'example-heavy', 'analogy'",
		}),
	],
	preview: {
		select: {
			title: "username",
			subtitle: "email",
			firstname: "firstname",
			lastname: "lastname",
		},
		prepare({ title, subtitle, firstname, lastname }) {
			return {
				title: `${firstname} ${lastname} (@${title})`,
				subtitle: subtitle,
			};
		},
	},
});
