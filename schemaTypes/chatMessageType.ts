import { CommentIcon, CodeIcon, DocumentIcon, LinkIcon, UploadIcon, PlayIcon, BulbOutlineIcon, RobotIcon } from "@sanity/icons";
import { defineField, defineType, defineArrayMember } from "sanity";

export const chatMessageType = defineType({
	name: "chatMessage",
	title: "Chat Message",
	type: "document",
	icon: CommentIcon,
	fields: [
		defineField({
			name: "messageId",
			title: "UIMessage ID",
			type: "string",
			description: "Stable ID from UIMessage (ai SDK).",
			validation: (rule) => rule.required().error("Message ID is required"),
		}),
		defineField({
			name: "session",
			title: "Session",
			type: "reference",
			to: [{ type: "chatSession" }],
			validation: (rule) => rule.required().error("Session reference is required"),
		}),
		defineField({
			name: "role",
			title: "Role",
			type: "string",
			options: {
				list: [
					{ title: "System", value: "system" },
					{ title: "User", value: "user" },
					{ title: "Assistant", value: "assistant" },
				],
				layout: "radio",
			},
			validation: (rule) => rule.required().error("Message role is required"),
		}),
		defineField({
			name: "metadata",
			title: "Metadata",
			type: "object",
			options: { collapsible: true, collapsed: true },
			description: "Additional metadata for the message",
			fields: [
				defineField({
					name: "custom",
					type: "text",
					title: "Custom JSON Data",
					description: "Store custom metadata as JSON string",
					rows: 3,
				}),
			],
		}),
		defineField({
			name: "parts",
			title: "Parts",
			type: "array",
			of: [
				// Text UI Part
				defineArrayMember({
					name: "textUIPart",
					title: "Text UI Part",
					type: "object",
					icon: DocumentIcon,
					fields: [
						defineField({
							name: "type",
							type: "string",
							initialValue: "text",
							readOnly: true,
						}),
						defineField({
							name: "text",
							type: "text",
							rows: 4,
							validation: (rule) => rule.required().error("Text content is required"),
						}),
						defineField({
							name: "state",
							type: "string",
							options: {
								list: [
									{ title: "Streaming", value: "streaming" },
									{ title: "Done", value: "done" },
								],
								layout: "radio",
							},
						}),
					],
					preview: {
						select: { title: "text", subtitle: "type" },
						prepare({ title, subtitle }) {
							return {
								title: title ? title.substring(0, 60) + (title.length > 60 ? "..." : "") : "Text Part",
								subtitle: subtitle,
								media: DocumentIcon,
							};
						},
					},
				}),
				// Reasoning UI Part
				defineArrayMember({
					name: "reasoningUIPart",
					title: "Reasoning UI Part",
					type: "object",
					icon: BulbOutlineIcon,
					fields: [
						defineField({
							name: "type",
							type: "string",
							initialValue: "reasoning",
							readOnly: true,
						}),
						defineField({
							name: "text",
							type: "text",
							rows: 4,
							validation: (rule) => rule.required().error("Reasoning text is required"),
						}),
						defineField({
							name: "state",
							type: "string",
							options: {
								list: [
									{ title: "Streaming", value: "streaming" },
									{ title: "Done", value: "done" },
								],
								layout: "radio",
							},
						}),
						defineField({
							name: "providerMetadata",
							type: "object",
							options: { collapsible: true, collapsed: true },
							fields: [
								defineField({
									name: "data",
									type: "text",
									title: "Provider Data",
									description: "Provider metadata as JSON string",
									rows: 3,
								}),
							],
						}),
					],
					preview: {
						select: { title: "text", subtitle: "type" },
						prepare({ title, subtitle }) {
							return {
								title: title ? title.substring(0, 60) + (title.length > 60 ? "..." : "") : "Reasoning Part",
								subtitle: subtitle,
								media: BulbOutlineIcon,
							};
						},
					},
				}),
				// Tool UI Part
				defineArrayMember({
					name: "toolUIPart",
					title: "Tool UI Part",
					type: "object",
					icon: CodeIcon,
					fields: [
						defineField({
							name: "type",
							type: "string",
							initialValue: "tool",
							readOnly: true,
						}),
						defineField({
							name: "name",
							type: "string",
							description: "Tool name, e.g. \"getWeather\" → type in UI will be `tool-getWeather`.",
							validation: (rule) => rule.required().error("Tool name is required"),
						}),
						defineField({
							name: "toolCallId",
							type: "string",
							validation: (rule) => rule.required().error("Tool call ID is required"),
						}),
						defineField({
							name: "state",
							type: "string",
							options: {
								list: [
									{ title: "Input Streaming", value: "input-streaming" },
									{ title: "Input Available", value: "input-available" },
									{ title: "Output Available", value: "output-available" },
									{ title: "Output Error", value: "output-error" },
								],
							},
						}),
						defineField({
							name: "input",
							type: "object",
							options: { collapsible: true, collapsed: true },
							fields: [
								defineField({
									name: "data",
									type: "text",
									title: "Input Data",
									description: "Tool input as JSON string",
									rows: 3,
								}),
							],
						}),
						defineField({
							name: "output",
							type: "object",
							options: { collapsible: true, collapsed: true },
							fields: [
								defineField({
									name: "data",
									type: "text",
									title: "Output Data",
									description: "Tool output as JSON string",
									rows: 3,
								}),
							],
						}),
						defineField({
							name: "errorText",
							type: "text",
						}),
						defineField({
							name: "providerExecuted",
							type: "boolean",
						}),
					],
					preview: {
						select: { title: "name", subtitle: "state" },
						prepare({ title, subtitle }) {
							return {
								title: title || "Tool Part",
								subtitle: subtitle || "tool",
								media: CodeIcon,
							};
						},
					},
				}),
				// Source URL UI Part
				defineArrayMember({
					name: "sourceUrlUIPart",
					title: "Source URL UI Part",
					type: "object",
					icon: LinkIcon,
					fields: [
						defineField({
							name: "type",
							type: "string",
							initialValue: "source-url",
							readOnly: true,
						}),
						defineField({
							name: "sourceId",
							type: "string",
							validation: (rule) => rule.required().error("Source ID is required"),
						}),
						defineField({
							name: "url",
							type: "url",
							validation: (rule) => rule.required().error("URL is required"),
						}),
						defineField({
							name: "title",
							type: "string",
						}),
						defineField({
							name: "providerMetadata",
							type: "object",
							options: { collapsible: true, collapsed: true },
							fields: [
								defineField({
									name: "data",
									type: "text",
									title: "Provider Data",
									description: "Provider metadata as JSON string",
									rows: 3,
								}),
							],
						}),
					],
					preview: {
						select: { title: "title", subtitle: "url" },
						prepare({ title, subtitle }) {
							return {
								title: title || "Source URL",
								subtitle: subtitle,
								media: LinkIcon,
							};
						},
					},
				}),
				// Source Document UI Part
				defineArrayMember({
					name: "sourceDocumentUIPart",
					title: "Source Document UI Part",
					type: "object",
					icon: DocumentIcon,
					fields: [
						defineField({
							name: "type",
							type: "string",
							initialValue: "source-document",
							readOnly: true,
						}),
						defineField({
							name: "sourceId",
							type: "string",
							validation: (rule) => rule.required().error("Source ID is required"),
						}),
						defineField({
							name: "mediaType",
							type: "string",
						}),
						defineField({
							name: "title",
							type: "string",
						}),
						defineField({
							name: "filename",
							type: "string",
						}),
						defineField({
							name: "providerMetadata",
							type: "object",
							options: { collapsible: true, collapsed: true },
							fields: [
								defineField({
									name: "data",
									type: "text",
									title: "Provider Data",
									description: "Provider metadata as JSON string",
									rows: 3,
								}),
							],
						}),
					],
					preview: {
						select: { title: "title", subtitle: "filename" },
						prepare({ title, subtitle }) {
							return {
								title: title || "Source Document",
								subtitle: subtitle,
								media: DocumentIcon,
							};
						},
					},
				}),
				// File UI Part
				defineArrayMember({
					name: "fileUIPart",
					title: "File UI Part",
					type: "object",
					icon: UploadIcon,
					fields: [
						defineField({
							name: "type",
							type: "string",
							initialValue: "file",
							readOnly: true,
						}),
						defineField({
							name: "mediaType",
							type: "string",
						}),
						defineField({
							name: "filename",
							type: "string",
							validation: (rule) => rule.required().error("Filename is required"),
						}),
						defineField({
							name: "url",
							type: "url",
							description: "Data URL or hosted URL",
							validation: (rule) => rule.required().error("File URL is required"),
						}),
					],
					preview: {
						select: { title: "filename", subtitle: "mediaType" },
						prepare({ title, subtitle }) {
							return {
								title: title || "File",
								subtitle: subtitle,
								media: UploadIcon,
							};
						},
					},
				}),
				// Data UI Part
				defineArrayMember({
					name: "dataUIPart",
					title: "Data UI Part",
					type: "object",
					icon: RobotIcon,
					fields: [
						defineField({
							name: "type",
							type: "string",
							initialValue: "data",
							readOnly: true,
						}),
						defineField({
							name: "name",
							type: "string",
							description: "Data part name, e.g. \"chart\" → type in UI will be `data-chart`.",
							validation: (rule) => rule.required().error("Data name is required"),
						}),
						defineField({
							name: "dataId",
							type: "string",
							validation: (rule) => rule.required().error("Data ID is required"),
						}),
						defineField({
							name: "data",
							type: "object",
							options: { collapsible: true, collapsed: true },
							fields: [
								defineField({
									name: "content",
									type: "text",
									title: "Data Content",
									description: "Data content as JSON string",
									rows: 3,
								}),
							],
						}),
					],
					preview: {
						select: { title: "name", subtitle: "dataId" },
						prepare({ title, subtitle }) {
							return {
								title: title || "Data Part",
								subtitle: subtitle,
								media: RobotIcon,
							};
						},
					},
				}),
				// Step Start UI Part
				defineArrayMember({
					name: "stepStartUIPart",
					title: "Step Start UI Part",
					type: "object",
					icon: PlayIcon,
					fields: [
						defineField({
							name: "type",
							type: "string",
							initialValue: "step-start",
							readOnly: true,
						}),
					],
					preview: {
						prepare() {
							return {
								title: "Step Start",
								subtitle: "step-start",
								media: PlayIcon,
							};
						},
					},
				}),
			],
			validation: (rule) => rule.required().min(1).error("At least one message part is required"),
		}),
	],
	preview: {
		select: { title: "role", subtitle: "messageId" },
		prepare({ title, subtitle }) {
			const roleIcon = title === "user" ? "👤" : title === "assistant" ? "🤖" : "⚙️";
			return {
				title: `${roleIcon} ${title}`,
				subtitle: subtitle,
				media: CommentIcon,
			};
		},
	},
});
