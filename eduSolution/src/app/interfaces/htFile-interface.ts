import { HomeworkTest } from "./homeworkTest-interface";

export interface HTFile {
    id: string;
    // name: string;
    // type: string;
    // fileData: Uint8Array;
    homeworkTest: HomeworkTest;
}