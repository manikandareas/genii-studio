import { CheckmarkCircleIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const userAchievementType = defineType({
	name: "userAchievement",
	title: "User Achievement",
	type: "document",
	icon: CheckmarkCircleIcon,
	fields: [
		defineField({
			name: "user",
			title: "User",
			type: "reference",
			to: [{ type: "user" }],
			validation: (rule) => rule.required().error("User is required"),
		}),
		defineField({
			name: "achievement",
			title: "Achievement",
			type: "reference",
			to: [{ type: "achievement" }],
			validation: (rule) =>
				rule.required().error("Achievement reference is required"),
		}),
		defineField({
			name: "earned",
			title: "Earned",
			type: "boolean",
			initialValue: false,
		}),
		defineField({
			name: "earnedAt",
			title: "Earned At",
			type: "datetime",
		}),
		defineField({
			name: "progress",
			title: "Current Progress",
			type: "number",
			validation: (rule) => rule.min(0),
		}),
		defineField({
			name: "notified",
			title: "User Notified",
			type: "boolean",
			initialValue: false,
		}),
	],
	preview: {
		select: {
			user: "user._ref",
			achievement: "achievement._ref",
			earned: "earned",
			progress: "progress",
		},
		prepare({ user, achievement, earned, progress }) {
			return {
				title: achievement ? `Achievement ${achievement}` : "Achievement",
				subtitle: earned ? "Earned" : progress ? `Progress: ${progress}` : "In progress",
			};
		},
	},
});

