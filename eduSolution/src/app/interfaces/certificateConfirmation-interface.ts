import { ClassGroup } from "./classGroup-interface";
import { User } from "./user-interface";

export interface CertificateConfirmation {
    id: number;
    gained: boolean;
    user: User;
    classGroup: ClassGroup;
    percentageScore: number;
}