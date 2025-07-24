import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const userType = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'username',
      type: 'string',
      description: 'Unique username for the user',
      validation: (rule) => rule.required().error('Username is required for user identification'),
    }),
    defineField({
      name: 'firstname',
      type: 'string',
      validation: (rule) => rule.required().error('First name is required'),
    }),
    defineField({
      name: 'lastname',
      type: 'string',
      validation: (rule) => rule.required().error('Last name is required'),
    }),
    defineField({
      name: 'email',
      type: 'string',
      validation: (rule) => [
        rule.required().error('Email is required'),
        rule.email().error('Must be a valid email address'),
      ],
    }),
    defineField({
      name: 'clerkId',
      type: 'string',
      description: 'Clerk authentication ID',
      validation: (rule) => rule.required().error('Clerk ID is required for authentication'),
    }),
    defineField({
      name: 'onboardingStatus',
      type: 'string',
      options: {
        list: [
          {title: 'Not Started', value: 'not_started'},
          {title: 'Completed', value: 'completed'},
        ],
        layout: 'radio',
      },
      initialValue: 'not_started',
    }),
  ],
  preview: {
    select: {
      title: 'username',
      subtitle: 'email',
      firstname: 'firstname',
      lastname: 'lastname',
    },
    prepare({title, subtitle, firstname, lastname}) {
      return {
        title: `${firstname} ${lastname} (@${title})`,
        subtitle: subtitle,
      }
    },
  },
})
