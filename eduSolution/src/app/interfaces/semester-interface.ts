import { Course } from "./course-interface";

export interface Semester {
    id: number;
    name: string; 
    courses: Course[];
}

