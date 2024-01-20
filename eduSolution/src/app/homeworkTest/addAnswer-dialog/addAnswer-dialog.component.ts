// add-event-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AFileService } from 'src/app/aFile/aFile-service/aFile.service';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { CourseService } from 'src/app/course/course-service/course.service';
import { ClassGroup } from 'src/app/interfaces/classGroup-interface';
import { Course } from 'src/app/interfaces/course-interface';

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './addAnswer-dialog.component.html',
  styleUrls: ['./addAnswer-dialog.component.css']
})
export class AddAnswerDialogComponent {
    

  constructor(
    public dialogRef: MatDialogRef<AddAnswerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private courseService: CourseService, private classGroupService: ClassGroupService, private aFileService: AFileService
    ) {
        const answerId = this.data.answerId;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  

  onCancelClick(): void {
    this.dialogRef.close();
  }

  aFileToUpload!: File;
  onAddAFile() {
    const answerId = this.data.answerId;
    if (this.aFileToUpload) {
      this.aFileService.uploadFile(this.aFileToUpload, answerId).subscribe(
        (response: string) => {
          console.log("Plik został przesłany:", response);
          const responseData = JSON.parse(response);
      
          
        },
        (uploadError) => {
          // console.error("Błąd podczas przesyłania pliku:", uploadError);
          console.log("aFileToUpload:", this.aFileToUpload);
          // console.log("answerId:", answer.id);
          location.reload();
        }
      );
    
    }
    
    else {
      console.log("Nie wybrano pliku.");
    }
  }

  onAFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.aFileToUpload = inputElement.files[0];
    }
  }

 
  
}
