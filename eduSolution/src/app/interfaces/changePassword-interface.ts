export interface ChangePassword {
    id: number;
    oldPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}