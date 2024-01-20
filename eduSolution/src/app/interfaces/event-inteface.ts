import { Time } from "@angular/common";
import { ClassGroup } from "./classGroup-interface";
import { Course } from "./course-interface";
import { Section } from "./section-interface";

export interface Event {
    id: number;
    name: string;
    startEventTime: Time;
    endEventTime: Time;
    eventDate: String;
    courses: Course[];
    classGroups: ClassGroup[];
    
}