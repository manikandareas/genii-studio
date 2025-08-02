import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const chatSessionType = defineType({
	name: "chatSession",
	title: "Chat Session",
	type: "document",
	icon: DocumentIcon,
	groups: [
		{
			name: "session",
			title: "Session",
			icon: DocumentIcon,
			default: true,
		},
		{
			name: "metadata",
			title: "Metadata",
			icon: DocumentIcon,
		},
	],
	fields: [
		defineField({
			name: "users",
			type: "array",
			of: [{ type: "reference", to: { type: "user" } }],
			group: "session",
			description: "Users participating in this chat session",
			validation: (rule) =>
				rule.required().min(1).error("At least one user is required"),
		}),
		defineField({
			name: "lessons",
			type: "array",
			of: [{ type: "reference", to: { type: "lesson" } }],
			group: "session",
			description: "Lessons associated with this chat session",
		}),
		defineField({
			name: "sessionId",
			type: "string",
			group: "session",
			description: "Unique identifier for the chat session",
			validation: (rule) =>
				rule.required().error("Session ID is required for identification"),
		}),
		defineField({
			name: "createdAt",
			type: "datetime",
			group: "session",
			description: "When the chat session was created",
			validation: (rule) =>
				rule.required().error("Creation timestamp is required"),
		}),
		defineField({
			name: "lastActivity",
			type: "datetime",
			group: "session",
			description: "Last activity timestamp in the session",
		}),
		defineField({
			name: "status",
			type: "string",
			group: "session",
			description: "Current status of the chat session",
			options: {
				list: [
					{ title: "Active", value: "active" },
					{ title: "Inactive", value: "inactive" },
					{ title: "Ended", value: "ended" },
				],
				layout: "radio",
			},
			initialValue: "active",
			validation: (rule) =>
				rule.required().error("Session status is required"),
		}),
		defineField({
			name: "metadata",
			type: "object",
			group: "metadata",
			description: "Additional session metadata",
			fields: [
				defineField({
					name: "userLevel",
					type: "string",
					description: "User's skill level during this session",
				}),
				defineField({
					name: "lessonTitle",
					type: "string",
					description: "Title of the lesson being discussed",
				}),
				defineField({
					name: "totalMessages",
					type: "number",
					description: "Total number of messages in this session",
					initialValue: 0,
					validation: (rule) =>
						rule.min(0).error("Total messages cannot be negative"),
				}),
			],
		}),
	],
	preview: {
		select: {
			sessionId: "sessionId",
			createdAt: "createdAt",
			status: "status",
			totalMessages: "metadata.totalMessages",
		},
		prepare({ sessionId, createdAt, status, totalMessages }) {
			const date = createdAt ? new Date(createdAt).toLocaleDateString() : "Unknown";
			return {
				title: `Session ${sessionId}`,
				subtitle: `${status} • ${totalMessages || 0} messages • ${date}`,
				media: DocumentIcon,
			};
		},
	},
});
