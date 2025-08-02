import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const chatMessageType = defineType({
	name: "chatMessage",
	title: "Chat Message",
	type: "document",
	icon: DocumentIcon,
	groups: [
		{
			name: "message",
			title: "Message",
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
			name: "sessions",
			type: "array",
			of: [{ type: "reference", to: { type: "chatSession" } }],
			group: "message",
			description: "Chat sessions this message belongs to",
			validation: (rule) =>
				rule.required().min(1).error("At least one session reference is required"),
		}),
		defineField({
			name: "role",
			type: "string",
			group: "message",
			description: "Role of the message sender",
			options: {
				list: [
					{ title: "User", value: "user" },
					{ title: "Assistant", value: "assistant" },
				],
				layout: "radio",
			},
			validation: (rule) =>
				rule.required().error("Message role is required"),
		}),
		defineField({
			name: "content",
			type: "text",
			group: "message",
			description: "The message content",
			validation: (rule) =>
				rule.required().error("Message content is required"),
		}),
		defineField({
			name: "timestamp",
			type: "datetime",
			group: "message",
			description: "When the message was sent",
			validation: (rule) =>
				rule.required().error("Message timestamp is required"),
		}),
		defineField({
			name: "status",
			type: "string",
			group: "message",
			description: "Current status of the message",
			options: {
				list: [
					{ title: "Streaming", value: "streaming" },
					{ title: "Completed", value: "completed" },
					{ title: "Error", value: "error" },
				],
				layout: "radio",
			},
			initialValue: "completed",
			validation: (rule) =>
				rule.required().error("Message status is required"),
		}),
		defineField({
			name: "metadata",
			type: "object",
			group: "metadata",
			description: "Additional message metadata",
			fields: [
				defineField({
					name: "model",
					type: "string",
					description: "AI model used to generate this message (if assistant role)",
				}),
				defineField({
					name: "tokens",
					type: "number",
					description: "Number of tokens used for this message",
					validation: (rule) =>
						rule.min(0).error("Token count cannot be negative"),
				}),
				defineField({
					name: "requestType",
					type: "string",
					description: "Type of request that generated this message",
				}),
				defineField({
					name: "processingTime",
					type: "number",
					description: "Time taken to process this message (in milliseconds)",
					validation: (rule) =>
						rule.min(0).error("Processing time cannot be negative"),
				}),
			],
		}),
	],
	preview: {
		select: {
			role: "role",
			content: "content",
			timestamp: "timestamp",
			status: "status",
		},
		prepare({ role, content, timestamp, status }) {
			const date = timestamp ? new Date(timestamp).toLocaleString() : "Unknown";
			const truncatedContent = content ? content.substring(0, 60) + (content.length > 60 ? "..." : "") : "No content";
			
			return {
				title: `${role === "user" ? "👤" : "🤖"} ${truncatedContent}`,
				subtitle: `${status} • ${date}`,
				media: DocumentIcon,
			};
		},
	},
});
