import { EduMaterial } from "./eduMaterial-interface";

export interface Section {
    id: number;
    name: string;
    eduMaterial: EduMaterial;
}