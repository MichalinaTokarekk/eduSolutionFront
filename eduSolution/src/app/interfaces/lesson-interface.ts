import { Time } from "@angular/common";
import { Course } from "./course-interface";
import { ClassGroup } from "./classGroup-interface";

export interface Lesson {
    id: number;
    name: string;
    dates: string[];
    startLessonTime: Time;
    endLessonTime: Time;
    dayName: string;
    course: Course;
    classGroup: ClassGroup;
}
