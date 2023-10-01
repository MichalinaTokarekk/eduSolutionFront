import { Section } from "./section-interface";

export interface EduMaterial {
    id: number;
    name: string;
    sections: Section[];
    
}