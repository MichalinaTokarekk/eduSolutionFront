import { Section } from "./section-interface";

export interface HomeworkTest {
    id: number;
    name: string;
    deadline: Date;
    section: Section[];
}