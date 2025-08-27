import { CheckmarkCircleIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const quizAttemptType = defineType({
  name: "quizAttempt",
  title: "Quiz Attempt",
  type: "document",
  icon: CheckmarkCircleIcon,
  groups: [
    { name: "identifiers", title: "Identifiers", icon: CheckmarkCircleIcon, default: true },
    { name: "result", title: "Result", icon: CheckmarkCircleIcon },
    { name: "timing", title: "Timing", icon: CheckmarkCircleIcon },
    { name: "meta", title: "Meta", icon: CheckmarkCircleIcon },
  ],
  fields: [
    // Identifiers
    defineField({
      name: "user",
      type: "array",
      group: "identifiers",
      of: [defineArrayMember({ type: "reference", to: { type: "user" } })],
      validation: (rule) => [
        rule.required().error("User reference is required"),
        rule.max(1).error("Only one user can be associated with an attempt"),
      ],
    }),
    defineField({
      name: "quiz",
      type: "array",
      group: "identifiers",
      of: [defineArrayMember({ type: "reference", to: { type: "quiz" } })],
      validation: (rule) => [
        rule.required().error("Quiz reference is required"),
        rule.max(1).error("Only one quiz can be associated with an attempt"),
      ],
    }),
    defineField({
      name: "course",
      type: "array",
      group: "identifiers",
      of: [defineArrayMember({ type: "reference", to: { type: "course" } })],
      validation: (rule) => rule.max(1).error("Only one course can be referenced"),
    }),
    defineField({
      name: "chapter",
      type: "array",
      group: "identifiers",
      of: [defineArrayMember({ type: "reference", to: { type: "chapter" } })],
      validation: (rule) => rule.max(1).error("Only one chapter can be referenced"),
    }),
    defineField({
      name: "attemptNumber",
      type: "number",
      group: "identifiers",
      description: "Sequential attempt number for this user+quiz",
      validation: (rule) => rule.min(1).warning("Attempt number should be 1 or greater"),
    }),

    // Status
    defineField({
      name: "status",
      type: "string",
      group: "result",
      options: {
        list: [
          { title: "In Progress", value: "in_progress" },
          { title: "Submitted", value: "submitted" },
          { title: "Graded", value: "graded" },
        ],
        layout: "radio",
      },
      initialValue: "submitted",
      validation: (rule) => rule.required().error("Status is required"),
    }),

    // Answers
    defineField({
      name: "answers",
      type: "array",
      group: "result",
      of: [
        defineArrayMember({
          type: "object",
          name: "answer",
          title: "Answer",
          fields: [
            defineField({
              name: "questionIndex",
              type: "number",
              title: "Question Index",
              description: "0-based index of the question in the quiz",
              validation: (rule) => [
                rule.required().error("Question index is required"),
                rule.min(0).error("Question index cannot be negative"),
                rule.integer().error("Question index must be a whole number"),
              ],
            }),
            defineField({
              name: "selectedOptionIndex",
              type: "number",
              title: "Selected Option Index",
              validation: (rule) => [
                rule.required().error("Selected option index is required"),
                rule.min(0).error("Selected option index cannot be negative"),
                rule.integer().error("Selected option index must be a whole number"),
              ],
            }),
            defineField({
              name: "isOutcome",
              type: "string",
              title: "Outcome",
              options: {
                list: [
                  { title: "Correct", value: "correct" },
                  { title: "Incorrect", value: "incorrect" },
                ],
                layout: "radio",
              },
              description: "Denormalized correctness for faster queries",
            }),
            defineField({
              name: "timeTakenMs",
              type: "number",
              title: "Time Taken (ms)",
            }),
          ],
          preview: {
            select: { q: "questionIndex", a: "selectedOptionIndex", o: "isOutcome" },
            prepare({ q, a, o }) {
              return {
                title: `Q${typeof q === "number" ? q + 1 : "?"} → A${typeof a === "number" ? a + 1 : "?"}`,
                subtitle: o || "",
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).error("At least one answer is required"),
    }),

    // Aggregates
    defineField({
      name: "correctCount",
      type: "number",
      group: "result",
      validation: (rule) => rule.min(0).warning("Correct count should be 0 or greater"),
    }),
    defineField({
      name: "totalQuestions",
      type: "number",
      group: "result",
      validation: (rule) => [
        rule.required().error("Total questions is required"),
        rule.min(1).error("Total questions must be at least 1"),
      ],
    }),
    defineField({
      name: "score",
      type: "number",
      group: "result",
      description: "Raw score value (optional)",
    }),
    defineField({
      name: "percentage",
      type: "number",
      group: "result",
      description: "Percentage score from 0 to 100 (optional)",
      validation: (rule) => [rule.min(0).warning("Min 0"), rule.max(100).warning("Max 100")],
    }),

    // Timing
    defineField({ name: "startedAt", type: "datetime", group: "timing" }),
    defineField({ name: "submittedAt", type: "datetime", group: "timing" }),
    defineField({ name: "durationMs", type: "number", group: "timing" }),

    // Feedback / Meta
    defineField({ name: "feedback", type: "text", group: "meta" }),
    defineField({
      name: "metadata",
      title: "Metadata",
      type: "object",
      group: "meta",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "custom",
          type: "text",
          title: "Custom JSON Data",
          rows: 3,
          description: "Store custom metadata as JSON string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      quizTitle: "quiz.0.title",
      username: "user.0.username",
      firstname: "user.0.firstname",
      lastname: "user.0.lastname",
      cc: "correctCount",
      tq: "totalQuestions",
      status: "status",
    },
    prepare({ quizTitle, username, firstname, lastname, cc, tq, status }) {
      const userLabel = username || [firstname, lastname].filter(Boolean).join(" ") || "Unknown user";
      const score = typeof cc === "number" && typeof tq === "number" ? `${cc}/${tq}` : "?/?";
      return {
        title: `${quizTitle || "Quiz"} • ${score}`,
        subtitle: `@${userLabel} • ${status || "submitted"}`,
      };
    },
  },
  orderings: [
    { title: "Submitted At (newest)", name: "submittedAtDesc", by: [{ field: "submittedAt", direction: "desc" }] },
    { title: "Percentage (high → low)", name: "percentageDesc", by: [{ field: "percentage", direction: "desc" }] },
    { title: "Correct (high → low)", name: "correctCountDesc", by: [{ field: "correctCount", direction: "desc" }] },
  ],
});
