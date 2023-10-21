import { Course } from "./course-interface";
import { TypeOfTestingKnowledge } from "./typeOfTestingKnowledge-interface";
import { User } from "./user-interface";

export interface Grade {
    id: number;
    value: number;
    description: string;
    student: User;
    teacher: User;
    typeOfTestingKnowledge: TypeOfTestingKnowledge;
    course: Course;
    isFinalValue: boolean;
}