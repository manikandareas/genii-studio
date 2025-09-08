import { defineArrayMember, defineType } from "sanity";
import { InfoOutlineIcon, WarningOutlineIcon, BulbOutlineIcon, HelpCircleIcon, CheckmarkCircleIcon } from '@sanity/icons';

export const blockContentType = defineType({
	name: "blockContent",
	title: "Block Content",
	type: "array",
	of: [
		defineArrayMember({
			title: "Block",
			type: "block",
			// Styles let you set what your user can mark up blocks with. These
			// correspond with HTML tags, but you can set any title or value
			// you want and decide how you want to deal with it where you want to
			// use your content.
			styles: [
				{ title: "Normal", value: "normal" },
				{ title: "H1", value: "h1" },
				{ title: "H2", value: "h2" },
				{ title: "H3", value: "h3" },
				{ title: "H4", value: "h4" },
				{ title: "Quote", value: "blockquote" },
			],
			lists: [
				{ title: "Bullet", value: "bullet" },
				{ title: "Numbered", value: "number" },
			],
			// Marks let you mark up inline text in the block editor.
			marks: {
				// Decorators usually describe a single property – e.g. a typographic
				// preference or highlight. They can be toggled on/off.
				decorators: [
					{ title: "Strong", value: "strong" },
					{ title: "Emphasis", value: "em" },
					{ title: "Code", value: "code" },
					{ title: "Underline", value: "underline" },
					{ title: "Strike", value: "strike-through" },
				],
				// Annotations can be any object structure – e.g. a link or a footnote.
				annotations: [
					{
						title: "URL",
						name: "link",
						type: "object",
						fields: [
							{
								title: "URL",
								name: "href",
								type: "url",
								validation: (Rule) =>
									Rule.uri({
										scheme: ["http", "https", "mailto", "tel"],
									}),
							},
						],
					},
				],
			},
		}),
		// You can add additional types here. For example:
		defineArrayMember({
			type: "image",
			options: { hotspot: true },
		}),
		defineArrayMember({
			type: "code",
		}),
		defineArrayMember({
			title: "Callout",
			name: "callout",
			type: "object",
			fields: [
				{
					name: "type",
					title: "Type",
					type: "string",
					options: {
						layout: "radio",
						list: [
							{ title: "Info", value: "info" },
							{ title: "Warning", value: "warning" },
							{ title: "Tip", value: "tip" },
							{ title: "Quiz", value: "quiz" },
							{ title: "Important", value: "important" },
						],
					},
					validation: (Rule) => Rule.required(),
				},
				{
					name: "content",
					title: "Content",
					type: "array",
					of: [
						defineArrayMember({
							type: "block",
							styles: [{ title: "Normal", value: "normal" }],
							marks: {
								decorators: [
									{ title: "Strong", value: "strong" },
									{ title: "Emphasis", value: "em" },
									{ title: "Code", value: "code" },
									{ title: "Underline", value: "underline" },
								],
							},
						}),
					],
					validation: (Rule) => Rule.required(),
				},
			],
			preview: {
				select: {
					type: "type",
					content: "content",
				},
				prepare({ type, content }: { type: string; content?: any[] }) {
					let title = "";
					if (content?.[0]?.children) {
						title = content[0].children
							.filter((child: any) => child._type === "span")
							.map((span: any) => span.text)
							.join("");
					}
					
					// Limit title length
					if (title.length > 50) {
						title = title.substring(0, 50) + "...";
					}

					const typeTitle = type ? type.charAt(0).toUpperCase() + type.slice(1) : "Callout";
					let icon: React.ComponentType;
					
					switch(type) {
						case "info": icon = InfoOutlineIcon; break;
						case "warning": icon = WarningOutlineIcon; break;
						case "tip": icon = BulbOutlineIcon; break;
						case "quiz": icon = HelpCircleIcon; break;
						case "important": icon = CheckmarkCircleIcon; break;
						default: icon = InfoOutlineIcon;
					}
					
					return {
						title: title || typeTitle + " Callout",
						subtitle: typeTitle,
						media: icon
					};
				},
			},
		}),
	],
});
