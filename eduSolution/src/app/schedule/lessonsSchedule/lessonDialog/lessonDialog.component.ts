import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LessonScheduleService } from '../lessonsSchedule-service/lessonsSchedule.service';

@Component({
  selector: 'app-lesson-dialog',
  templateUrl: './lessonDialog.component.html',
  styleUrls: ['./lessonDialog.component.css']
})
export class LessonDialogComponent {
  editedLesson: any;
  editedLessonForm: FormGroup;
  courses: any[] = [];
  classGroups: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<LessonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private lessonService: LessonScheduleService
  ) {
    // Sprawdź, czy data.lesson istnieje, a jeśli nie, zainicjalizuj pusty obiekt
    this.editedLesson = data.lesson || {};
    
    this.editedLessonForm = this.formBuilder.group({
      dayName: [this.editedLesson?.dayName || '', Validators.required],
      startLessonTime: [this.editedLesson?.startLessonTime || '', Validators.required],
      endLessonTime: [this.editedLesson?.endLessonTime || '', Validators.required],
      course: [data.lesson?.course ? data.lesson.course.id : null],
      classGroup: [data.lesson?.classGroup ? data.lesson.classGroup.id : null],
    });

    this.courses = data.courses || [];
    this.classGroups = data.classGroups || [];
  }



  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.editedLessonForm.valid) {
      // Przeslij zmienione dane lekcji do komponentu nadrzędnego
      const editedLesson = { ...this.editedLessonForm.value, id: this.editedLesson.id };

      // Użyj metody update z serwisu do aktualizacji danych lekcji
      this.lessonService.update(editedLesson).subscribe(() => {
        this.dialogRef.close(editedLesson);
      });
    }
  }

  onDeleteClick(): void {
    const lessonId = this.editedLesson.id;
  
    if (lessonId) {
      this.lessonService.remove(lessonId).subscribe(() => {
        this.dialogRef.close();
      });
    }
}

}
