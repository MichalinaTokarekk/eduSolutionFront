import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog-semester.component.html',
  styleUrls: ['./confirmation-dialog-semester.component.css']
})
export class ConfirmationDialogSemesterComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogSemesterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
  
}
