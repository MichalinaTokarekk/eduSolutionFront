import { ClassGroup } from "./classGroup-interface";
import { Course } from "./course-interface";
import { Section } from "./section-interface";

export interface Event {
    id: number;
    name: string;
    eventDate: String;
    courses: Course[];
    classGroups: ClassGroup[];
    
}