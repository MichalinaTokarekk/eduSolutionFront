import { Role } from "./role-interface";

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    streetName: string;
    buildingNumber: number;
    apartmentNumber: number;
    city: string;
    post: string;
    postCode: string;
    country: string;
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    role: Role;
}
  