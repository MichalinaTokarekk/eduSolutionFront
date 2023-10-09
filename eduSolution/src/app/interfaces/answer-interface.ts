import { AnswerStaus } from "./answerStatus-interface";
import { HomeworkTest } from "./homeworkTest-interface";
import { User } from "./user-interface";

export interface Answer {
    id: number;
    answerContent: string;
    // comment: string;
    homeworkTest: HomeworkTest;
    user: User;
    // answerStatus: AnswerStaus
}