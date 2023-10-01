import { EduMaterial } from "./eduMaterial-interface";

export interface EMFile {
    id: number;
    filePath: string;
    eduMaterials: EduMaterial[];
}