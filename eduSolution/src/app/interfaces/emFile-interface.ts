import { EduMaterial } from "./eduMaterial-interface";

export interface EMFile {
    id: string;
    // name: string;
    // type: string;
    // fileData: Uint8Array;
    eduMaterial: EduMaterial;
}