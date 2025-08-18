import { chapterType } from "./chapterType";
import { chatMessageType } from "./chatMessageType";
import { chatSessionType } from "./chatSessionType";
import { courseType } from "./courseType";
import { enrollmentType } from "./enrollmentType";
import { lessonType } from "./lessonType";
import { quizType } from "./quizType";
import { recommendationType } from "./recommendationType";
import { topicType } from "./topicType";
import { userType } from "./userType";

export const schemaTypes = [
	userType,
	topicType,
	courseType,
	chapterType,
	lessonType,
	quizType,
	enrollmentType,
	recommendationType,
	chatSessionType,
	chatMessageType,
];
