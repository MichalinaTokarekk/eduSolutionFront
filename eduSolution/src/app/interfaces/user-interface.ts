import { ClassGroup } from "./classGroup-interface";
import { Role } from "./role-interface";
import { UserStatus } from "./userStatus-interface";

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    post: string;
    postCode: string;
    country: string;
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    role: Role;
    classGroups: ClassGroup;
    userStatus: UserStatus;
}
  