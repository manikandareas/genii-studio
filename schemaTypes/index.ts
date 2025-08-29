import { chapterType } from "./chapterType";
import { chatMessageType } from "./chatMessageType";
import { chatSessionType } from "./chatSessionType";
import { courseType } from "./courseType";
import { enrollmentType } from "./enrollmentType";
import { lessonType } from "./lessonType";
import { quizType } from "./quizType";
import { quizAttemptType } from "./quizAttemptType";
import { recommendationType } from "./recommendationType";
import { topicType } from "./topicType";
import { userType } from "./userType";
import { learningSessionType } from "./learningSessionType";
import { achievementType } from "./achievementType";
import { userAchievementType } from "./userAchievementType";

export const schemaTypes = [
  userType,
  topicType,
  courseType,
  chapterType,
  lessonType,
  quizType,
  quizAttemptType,
  enrollmentType,
  recommendationType,
  learningSessionType,
  achievementType,
  userAchievementType,
  chatSessionType,
  chatMessageType,
];
