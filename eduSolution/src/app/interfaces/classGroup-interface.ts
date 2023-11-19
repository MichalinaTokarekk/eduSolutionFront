import { Course } from "./course-interface";
import { Semester } from "./semester-interface";

export interface ClassGroup {
    id: number;
    name: string;
    semester: Semester;
    course: Course;
}