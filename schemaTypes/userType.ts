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
		{
			name: "analytics",
			title: "Analytics",
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
			title: "Focus",
			type: "array",
			group: "study",
			of: [{ type: "string" }],
			options: {
				layout: "tags"
			},
		}),
		defineField({
			name: "studyReason",
			type: "string",
			group: "study",
			hidden: true,
		}),
		defineField({
			name: "studyPlan",
			type: "string",
			group: "study",
			hidden: true,
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
			name: "explanationStyle",
			title: "Explanation Style",
			type: "string",
			group: "study",
			description:
				"Learning delivery preference, e.g., 'storytelling', 'example-heavy', 'analogy'",
		}),
		defineField({
			name: "languagePreference",
			type: "string",
			group: "study",
			description: "Preferred language for AI chat",
			options: {
				list: [
					{ title: "Bahasa Indonesia", value: "id" },
					{ title: "English", value: "en" },
					{ title: "Mixed", value: "mix" },
				],
				layout: "radio",
			},
		}),
		defineField({
			name: "goal",
			type: "string",
			group: "study",
			description: "Learning goal to sharpen recommendations and chat context",
			validation: (rule) => rule.max(120).warning("Goal should be concise (max 120 characters)"),
		}),
		defineField({
			name: "analytics",
			title: "Learning Analytics",
			type: "object",
			group: "analytics",
			options: { collapsible: true, collapsed: true },
			fields: [
				defineField({
					name: "totalXP",
					title: "Total Experience Points",
					type: "number",
					initialValue: 0,
					validation: (rule) => rule.min(0),
				}),
				defineField({
					name: "currentLevel",
					title: "Current Level",
					type: "number",
					initialValue: 1,
					validation: (rule) => rule.min(1),
				}),
				defineField({
					name: "totalStudyTimeMinutes",
					title: "Total Study Time (Minutes)",
					type: "number",
					initialValue: 0,
					validation: (rule) => rule.min(0),
				}),
				defineField({
					name: "averageSessionTime",
					title: "Average Session Time (Minutes)",
					type: "number",
					initialValue: 0,
					validation: (rule) => rule.min(0),
				}),
				defineField({
					name: "strongestSkills",
					title: "Strongest Skills",
					type: "array",
					of: [{ type: "string" }],
				}),
				defineField({
					name: "improvementAreas",
					title: "Areas for Improvement",
					type: "array",
					of: [{ type: "string" }],
				}),
			],
		}),
		defineField({
			name: "emailPreferences",
			title: "Email Preferences",
			type: "object",
			group: "settings",
			options: { collapsible: true, collapsed: true },
			fields: [
				defineField({
					name: "welcomeEmail",
					type: "boolean",
					initialValue: true,
				}),
				defineField({
					name: "achievementEmails",
					type: "boolean",
					initialValue: true,
				}),
				defineField({
					name: "courseCompletionEmails",
					type: "boolean",
					initialValue: true,
				}),
				defineField({
					name: "weeklyDigest",
					type: "boolean",
					initialValue: true,
				}),
				defineField({ name: "unsubscribedAt", type: "datetime" }),
			],
		}),
		defineField({
			name: "lastEmailSent",
			title: "Last Email Sent",
			type: "datetime",
			group: "settings",
		}),
		defineField({
			name: "emailStats",
			title: "Email Statistics",
			type: "object",
			group: "settings",
			options: { collapsible: true, collapsed: true },
			fields: [
				defineField({ name: "totalSent", type: "number", initialValue: 0 }),
				defineField({ name: "totalOpened", type: "number", initialValue: 0 }),
				defineField({ name: "lastOpenedAt", type: "datetime" }),
			],
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
