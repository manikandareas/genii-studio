import { PlayIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const learningSessionType = defineType({
	name: "learningSession",
	title: "Learning Session",
	type: "document",
	icon: PlayIcon,
	groups: [
		{ name: "session", title: "Session", icon: PlayIcon, default: true },
		{ name: "activities", title: "Activities", icon: PlayIcon },
	],
	fields: [
		defineField({
			name: "user",
			title: "User",
			type: "reference",
			group: "session",
			to: [{ type: "user" }],
			validation: (rule) => rule.required().error("User is required"),
		}),
		defineField({
			name: "course",
			title: "Course",
			type: "reference",
			group: "session",
			to: [{ type: "course" }],
		}),
		defineField({
			name: "startTime",
			title: "Session Start",
			type: "datetime",
			group: "session",
			validation: (rule) => rule.required().error("Start time is required"),
		}),
		defineField({
			name: "endTime",
			title: "Session End",
			type: "datetime",
			group: "session",
		}),
		defineField({
			name: "durationMinutes",
			title: "Duration (Minutes)",
			type: "number",
			group: "session",
			validation: (rule) => rule.min(0),
		}),
		defineField({
			name: "activitiesCompleted",
			title: "Activities Completed",
			type: "array",
			group: "activities",
			of: [
				defineArrayMember({
					type: "object",
					fields: [
						defineField({
							name: "type",
							title: "Activity Type",
							type: "string",
							options: {
								list: [
									{ title: "Lesson", value: "lesson" },
									{ title: "Quiz", value: "quiz" },
									{ title: "Reading", value: "reading" },
								],
								layout: "radio",
							},
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "contentId",
							title: "Content ID",
							type: "string",
						}),
						defineField({
							name: "timeSpent",
							title: "Time Spent (Minutes)",
							type: "number",
							validation: (rule) => rule.min(0),
						}),
					],
				}),
			],
		}),
	],
	preview: {
		select: {
			title: "startTime",
			subtitle: "durationMinutes",
		},
		prepare({ title, subtitle }) {
			const formatted = title
				? new Date(title).toLocaleString()
				: "Learning Session";
			return {
				title: formatted,
				subtitle: subtitle ? `${subtitle} min` : undefined,
			};
		},
	},
});

