import { Answer } from "./answer-interface";
import { HomeworkTest } from "./homeworkTest-interface";

export interface AFile {
    id: string;
    // name: string;
    // type: string;
    // fileData: Uint8Array;
    answer: Answer;
}