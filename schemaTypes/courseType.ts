import {defineField, defineType, defineArrayMember} from 'sanity'
import {PlayIcon} from '@sanity/icons'

export const courseType = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  icon: PlayIcon,
  groups: [
    {
      name: 'content',
      title: 'Content',
      icon: PlayIcon,
      default: true,
    },
    {
      name: 'settings',
      title: 'Settings',
      icon: PlayIcon,
    },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (rule) => [
        rule.required().error('Title is required'),
        rule.min(5).warning('Title should be at least 5 characters'),
        rule.max(80).warning('Title should be under 80 characters for better readability'),
      ],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Slug is required for URL generation'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      group: 'content',
      rows: 4,
      validation: (rule) => [
        rule.required().error('Description is required'),
        rule.min(20).warning('Description should be at least 20 characters'),
        rule.max(500).warning('Description should be under 500 characters'),
      ],
    }),
    defineField({
      name: 'difficulty',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          {title: 'Beginner', value: 'beginner'},
          {title: 'Intermediate', value: 'intermediate'},
          {title: 'Advanced', value: 'advanced'},
        ],
        layout: 'radio',
      },
      initialValue: 'beginner',
      validation: (rule) => rule.required().error('Difficulty level is required'),
    }),
    defineField({
      name: 'thumbnail',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required().error('Thumbnail image is required'),
    }),
    defineField({
      name: 'trailer',
      type: 'url',
      group: 'content',
      description: 'YouTube URL for the course trailer',
      validation: (rule) => [
        rule.uri({
          scheme: ['http', 'https'],
        }),
      ],
    }),
    defineField({
      name: 'topics',
      type: 'array',
      group: 'settings',
      of: [defineArrayMember({type: 'reference', to: {type: 'topic'}})],
      validation: (rule) => rule.min(1).error('At least one topic is required'),
    }),
    defineField({
      name: 'chapters',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'reference', to: {type: 'chapter'}})],
      options: {
        sortable: true,
      },
      validation: (rule) => rule.min(1).error('At least one chapter is required'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      difficulty: 'difficulty',
      media: 'thumbnail',
      topics: 'topics',
    },
    prepare({title, difficulty, media, topics}) {
      const topicCount = topics ? topics.length : 0
      return {
        title: title,
        subtitle: `${difficulty} • ${topicCount} topic${topicCount !== 1 ? 's' : ''}`,
        media: media,
      }
    },
  },
  orderings: [
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
    {
      title: 'Difficulty',
      name: 'difficulty',
      by: [{field: 'difficulty', direction: 'asc'}],
    },
  ],
})
