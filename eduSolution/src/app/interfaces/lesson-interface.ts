import { Time } from "@angular/common";
import { Course } from "./course-interface";
import { ClassGroup } from "./classGroup-interface";

export interface Lesson {
    id: number;
    startLessonTime: Time;
    endLessonTime: Time;
    dayName: string;
    course: Course;
    classGroup: ClassGroup;
}
