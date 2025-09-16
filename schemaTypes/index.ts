import { achievementType } from "./achievementType";
import { aiArtifactType } from "./aiArtifactType";
import { blockContentType } from "./blockContentType";
import { chapterType } from "./chapterType";
import { chatMessageType } from "./chatMessageType";
import { chatSessionType } from "./chatSessionType";
import { courseType } from "./courseType";
import { emailNotificationType } from "./emailNotificationType";
import { enrollmentType } from "./enrollmentType";
import { learningSessionType } from "./learningSessionType";
import { lessonType } from "./lessonType";
import { quizAttemptType } from "./quizAttemptType";
import { quizType } from "./quizType";
import { recommendationType } from "./recommendationType";
import { topicType } from "./topicType";
import { userAchievementType } from "./userAchievementType";
import { userType } from "./userType";

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
  emailNotificationType,
  aiArtifactType,
  blockContentType,
];
