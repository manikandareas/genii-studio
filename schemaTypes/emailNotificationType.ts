import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const emailNotificationType = defineType({
	name: "emailNotification",
	title: "Email Notification",
	type: "document",
	icon: DocumentIcon,
	fields: [
		defineField({
			name: "user",
			title: "User",
			type: "reference",
			to: [{ type: "user" }],
			validation: (rule) => rule.required().error("User is required"),
		}),
		defineField({
			name: "type",
			title: "Type",
			type: "string",
			options: {
				list: [
					{ title: "Welcome", value: "welcome" },
					{ title: "Achievement", value: "achievement" },
					{ title: "Course Completion", value: "courseCompletion" },
					{ title: "Weekly Digest", value: "weeklyDigest" },
				],
				layout: "radio",
			},
			validation: (rule) => rule.required().error("Type is required"),
		}),
		defineField({
			name: "subject",
			title: "Subject",
			type: "string",
			validation: (rule) => rule.required().error("Subject is required"),
		}),
		defineField({
			name: "content",
			title: "Content",
			type: "text",
			rows: 6,
			validation: (rule) => rule.required().error("Content is required"),
		}),
		defineField({
			name: "sentAt",
			title: "Sent At",
			type: "datetime",
		}),
		defineField({
			name: "deliveryStatus",
			title: "Delivery Status",
			type: "string",
			options: {
				list: [
					{ title: "Sent", value: "sent" },
					{ title: "Delivered", value: "delivered" },
					{ title: "Opened", value: "opened" },
					{ title: "Failed", value: "failed" },
				],
				layout: "radio",
			},
		}),
		defineField({
			name: "resendId",
			title: "Resend ID",
			type: "string",
		}),
		defineField({
			name: "metadata",
			title: "Metadata",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				defineField({
					name: "data",
					title: "Data (JSON)",
					type: "text",
					rows: 3,
					description: "Arbitrary metadata as JSON string",
				}),
			],
		}),
	],
	preview: {
		select: { title: "subject", subtitle: "type" },
		prepare({ title, subtitle }) {
			return {
				title: title || "Email Notification",
				subtitle: subtitle,
				media: DocumentIcon,
			};
		},
	},
});
