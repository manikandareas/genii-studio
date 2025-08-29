# Sanity Schema Extensions for Progress Page Features

## Overview

The progress page has been implemented with existing Sanity data for core features, but several advanced features are currently using dummy data. This task outlines what needs to be added to your Sanity schema to replace the dummy data with real, persistent data.

## Current Implementation Status

### ✅ Implemented with Real Data
- **User Progress Data**: Study streak, learning goals, study plan, level
- **Course Enrollments**: Progress tracking, completion status, content completed
- **Quiz Performance**: Quiz attempts, scores, performance analytics
- **Activity Feed**: Recent quiz attempts and completed content
- **Learning Statistics**: Enrollment counts, completion rates, average scores

### 🔧 Using Dummy Data (Needs Sanity Integration)
- **Achievement System**: Badges, milestones, progress tracking
- **Advanced Analytics**: Learning velocity, skill progress charts (future enhancement)

## Required Sanity Schema Extensions

### 1. Achievement System

Create a new document type for achievements:

```javascript
// schemas/achievement.js
export default {
  name: 'achievement',
  title: 'Achievement',
  type: 'document',
  fields: [
    {
      name: 'id',
      title: 'Achievement ID',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required().max(50)
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required().max(200)
    },
    {
      name: 'icon',
      title: 'Icon (Emoji)',
      type: 'string',
      validation: Rule => Rule.required().max(5)
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'First Steps', value: 'first_steps' },
          { title: 'Learning Streak', value: 'streak' },
          { title: 'Quiz Performance', value: 'quiz' },
          { title: 'Course Completion', value: 'course' },
          { title: 'Social Learning', value: 'social' }
        ]
      }
    },
    {
      name: 'criteria',
      title: 'Achievement Criteria',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Criteria Type',
          type: 'string',
          options: {
            list: [
              'lesson_count',
              'quiz_score',
              'course_completion',
              'streak_days',
              'custom'
            ]
          }
        },
        {
          name: 'target',
          title: 'Target Value',
          type: 'number'
        },
        {
          name: 'threshold',
          title: 'Threshold (for percentages)',
          type: 'number',
          description: 'For quiz scores, etc.'
        }
      ]
    },
    {
      name: 'points',
      title: 'XP Points',
      type: 'number',
      validation: Rule => Rule.min(0)
    },
    {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true
    }
  ]
}
```

Create a user achievement tracking document:

```javascript
// schemas/userAchievement.js
export default {
  name: 'userAchievement',
  title: 'User Achievement',
  type: 'document',
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'user' }] }],
      validation: Rule => Rule.required().max(1)
    },
    {
      name: 'achievement',
      title: 'Achievement',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'achievement' }] }],
      validation: Rule => Rule.required().max(1)
    },
    {
      name: 'earned',
      title: 'Earned',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'earnedAt',
      title: 'Earned At',
      type: 'datetime'
    },
    {
      name: 'progress',
      title: 'Current Progress',
      type: 'number',
      validation: Rule => Rule.min(0)
    },
    {
      name: 'notified',
      title: 'User Notified',
      type: 'boolean',
      initialValue: false
    }
  ]
}
```

### 2. Learning Analytics (Future Enhancement)

Extend the existing user schema:

```javascript
// Add these fields to your existing user schema
{
  name: 'analytics',
  title: 'Learning Analytics',
  type: 'object',
  fields: [
    {
      name: 'totalXP',
      title: 'Total Experience Points',
      type: 'number',
      initialValue: 0
    },
    {
      name: 'currentLevel',
      title: 'Current Level',
      type: 'number',
      initialValue: 1
    },
    {
      name: 'totalStudyTimeMinutes',
      title: 'Total Study Time (Minutes)',
      type: 'number',
      initialValue: 0
    },
    {
      name: 'averageSessionTime',
      title: 'Average Session Time',
      type: 'number',
      initialValue: 0
    },
    {
      name: 'strongestSkills',
      title: 'Strongest Skills',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'improvementAreas',
      title: 'Areas for Improvement',
      type: 'array',
      of: [{ type: 'string' }]
    }
  ]
}
```

Create learning session tracking:

```javascript
// schemas/learningSession.js
export default {
  name: 'learningSession',
  title: 'Learning Session',
  type: 'document',
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'user' }] }],
      validation: Rule => Rule.required().max(1)
    },
    {
      name: 'course',
      title: 'Course',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'course' }] }],
      validation: Rule => Rule.max(1)
    },
    {
      name: 'startTime',
      title: 'Session Start',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'endTime',
      title: 'Session End',
      type: 'datetime'
    },
    {
      name: 'durationMinutes',
      title: 'Duration (Minutes)',
      type: 'number',
      validation: Rule => Rule.min(0)
    },
    {
      name: 'activitiesCompleted',
      title: 'Activities Completed',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Activity Type',
              type: 'string',
              options: {
                list: ['lesson', 'quiz', 'reading']
              }
            },
            {
              name: 'contentId',
              title: 'Content ID',
              type: 'string'
            },
            {
              name: 'timeSpent',
              title: 'Time Spent (Minutes)',
              type: 'number'
            }
          ]
        }
      ]
    }
  ]
}
```

## Required GROQ Query Extensions

### Achievement Queries

```javascript
// Get user achievements
export const getUserAchievementsQuery = defineQuery(`
  *[_type == "userAchievement" && user[0]._ref == $userId]{
    _id,
    earned,
    earnedAt,
    progress,
    achievement[0]->{
      _id,
      id,
      title,
      description,
      icon,
      category,
      criteria,
      points
    }
  }
`);

// Get available achievements
export const getAvailableAchievementsQuery = defineQuery(`
  *[_type == "achievement" && isActive == true] | order(category, points asc)
`);
```

### Analytics Queries (Future Enhancement)

```javascript
// Get learning sessions
export const getLearningSessionsQuery = defineQuery(`
  *[_type == "learningSession" && 
    user[0]._ref == $userId && 
    startTime >= $fromDate] | order(startTime desc)
`);

// Get weekly learning data
export const getWeeklyLearningDataQuery = defineQuery(`
  {
    "sessions": *[_type == "learningSession" && 
      user[0]._ref == $userId && 
      startTime >= $weekStart && 
      startTime <= $weekEnd],
    "totalTime": math::sum(*[_type == "learningSession" && 
      user[0]._ref == $userId && 
      startTime >= $weekStart && 
      startTime <= $weekEnd].durationMinutes),
    "averageSessionTime": math::avg(*[_type == "learningSession" && 
      user[0]._ref == $userId && 
      startTime >= $weekStart && 
      startTime <= $weekEnd].durationMinutes)
  }
`);
```

## Integration Steps

1. **Add Schema Files**: Add the new schema files to your Sanity studio
2. **Deploy Schema**: Deploy the updated schema to your Sanity project
3. **Update Hooks**: Create new TanStack Query hooks for the new data
4. **Replace Dummy Data**: Replace the `generateDummy*` functions with real data fetchers
5. **Add Automation**: Create webhooks or scheduled functions to update achievements and goals
6. **Testing**: Test the new features thoroughly

## Technical Considerations

- **Performance**: Index frequently queried fields (user references, dates)
- **Data Consistency**: Set up proper validation rules
- **User Privacy**: Consider data retention policies
- **Notifications**: Plan achievement notification system
- **Backup**: Ensure achievement and goal data is backed up

## Estimated Development Time (Achievement System Only)

- Achievement schema creation and deployment: 1-2 hours
- Query and hook development: 2-3 hours
- Achievement automation logic: 4-6 hours
- Testing and refinement: 2-3 hours

**Total: 9-14 hours**

## Next Steps

1. Review and approve this schema design
2. Implement the schema changes in your Sanity studio
3. Create the necessary queries and hooks for achievements
4. Build the achievement calculation logic
5. Replace dummy achievement data with real data components
6. Add achievement notification system
7. Test thoroughly with real user data

This will transform your progress page's achievement system from using dummy data to a fully functional, persistent gamification system. The focus is now on achievements only, making it more manageable to implement.