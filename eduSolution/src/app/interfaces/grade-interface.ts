import { ClassGroup } from "./classGroup-interface";
import { Semester } from "./semester-interface";
import { TypeOfTestingKnowledge } from "./typeOfTestingKnowledge-interface";
import { User } from "./user-interface";

export interface Grade {
    id: number;
    value: number;
    description: string;
    student: User;
    teacher: User;
    typeOfTestingKnowledge: TypeOfTestingKnowledge;
    classGroup: ClassGroup;
    finalValue: boolean;
    semester: Semester;
}

