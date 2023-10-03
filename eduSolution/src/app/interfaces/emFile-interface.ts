import { EduMaterial } from "./eduMaterial-interface";

export interface EMFile {
    id: number;
    name: string;
    type: string;
    // fileData: Uint8Array;
    eduMaterials: EduMaterial[];
}