import { defineArrayMember, defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons";

export const quizType = defineType({
	name: "quiz",
	title: "Quiz",
	type: "document",
	icon: HelpCircleIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			validation: (rule) => [
				rule.required().error("Title is required"),
				rule.min(3).warning("Title should be at least 3 characters"),
				rule
					.max(120)
					.warning(
						"Title should be under 120 characters for better readability",
					),
			],
		}),
		defineField({
			name: "slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: 96,
			},
			validation: (rule) =>
				rule.required().error("Slug is required for URL generation"),
		}),
		defineField({
			name: "description",
			type: "text",
			rows: 3,
			validation: (rule) => [
				rule.required().error("Description is required"),
				rule.min(10).warning("Description should be at least 10 characters"),
				rule.max(300).warning("Description should be under 300 characters"),
			],
		}),
		defineField({
			name: "questions",
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					name: "question",
					title: "Question",
					fields: [
						defineField({
							name: "question",
							type: "string",
							title: "Question Text",
							validation: (rule) => [
								rule.required().error("Question text is required"),
								rule
									.min(10)
									.warning("Question should be at least 10 characters"),
							],
						}),
						defineField({
							name: "options",
							type: "array",
							of: [defineArrayMember({ type: "string" })],
							validation: (rule) => [
								rule.required().error("Options are required"),
								rule
									.min(2)
									.error("At least 2 options are required for a question"),
								rule
									.max(6)
									.warning("Consider limiting options to 6 for better UX"),
							],
						}),
						defineField({
							name: "correctOptionIndex",
							type: "number",
							title: "Correct Option Index",
							description:
								"Index of the correct option (0-based, e.g., 0 for first option)",
							validation: (rule) => [
								rule.required().error("Correct option index is required"),
								rule.min(0).error("Index cannot be negative"),
								rule.integer().error("Index must be a whole number"),
							],
						}),
						defineField({
							name: "explanation",
							type: "text",
							rows: 2,
							description: "Explanation for why this answer is correct",
							validation: (rule) =>
								rule
									.min(10)
									.warning("Explanation should be at least 10 characters"),
						}),
					],
					preview: {
						select: {
							title: "question",
							options: "options",
							correctIndex: "correctOptionIndex",
						},
						prepare({ title, options, correctIndex }) {
							const optionCount = options ? options.length : 0;
							const correctOption =
								options && correctIndex !== undefined
									? options[correctIndex]
									: "Not set";
							return {
								title: title,
								subtitle: `${optionCount} options • Correct: ${correctOption}`,
							};
						},
					},
				}),
			],
			options: {
				sortable: true,
			},
			validation: (rule) =>
				rule.min(1).error("At least one question is required"),
		}),
	],
	preview: {
		select: {
			title: "title",
			description: "description",
			questions: "questions",
		},
		prepare({ title, description, questions }) {
			const questionCount = questions ? questions.length : 0;
			return {
				title: title,
				subtitle: `${questionCount} question${questionCount !== 1 ? "s" : ""} • ${description}`,
			};
		},
	},
});
