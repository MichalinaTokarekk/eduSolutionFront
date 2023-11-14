import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LessonScheduleService } from '../lessonsSchedule-service/lessonsSchedule.service';

@Component({
  selector: 'app-lesson-create-dialog',
  templateUrl: './lessonCreateDialog.component.html',
  styleUrls: ['./lessonCreateDialog.component.css']
})
export class LessonCreateDialogComponent {
  lessonForm: FormGroup;
  courses: any[] = []; // Zaimportuj odpowiednią klasę dla kursów
  classGroups: any[] = []; // Zaimportuj odpowiednią klasę dla grup lekcyjnych

  constructor(
    public dialogRef: MatDialogRef<LessonCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private lessonService: LessonScheduleService
  ) {
    
    this.lessonForm = this.formBuilder.group({
      dayName: ['', Validators.required],
      startLessonTime: ['', Validators.required],
      endLessonTime: ['', Validators.required],
      courseId: [null, Validators.required], // Domyślnie null
      classGroupId: [null, Validators.required] // Domyślnie null
    });

    this.courses = data.courses || [];
    this.classGroups = data.classGroups || [];
  }

//   onCreateClick(): void {
//     if (this.lessonForm.valid) {
//       const newLesson = this.lessonForm.value;

//       this.lessonService.save(newLesson).subscribe((createdLesson) => {
//         this.dialogRef.close(createdLesson);
//       });
//     }
//   }

onCreateClick(): void {
    if (this.lessonForm.valid) {
      const newLesson = this.lessonForm.value;

      // Konwersja courseId i classGroupId na liczby
      newLesson.courseId = parseInt(newLesson.courseId, 10);
      newLesson.classGroupId = parseInt(newLesson.classGroupId, 10);

      // Ręczne przypisanie obiektu course
      const selectedCourse = this.courses.find(course => course.id === newLesson.courseId);
      newLesson.course = selectedCourse;

      // Ręczne przypisanie obiektu classGroup
      const selectedClassGroup = this.classGroups.find(classGroup => classGroup.id === newLesson.classGroupId);
      newLesson.classGroup = selectedClassGroup;

      console.log('newLesson before save:', newLesson);

      this.lessonService.save(newLesson).subscribe((createdLesson) => {
        console.log('createdLesson:', createdLesson);
        this.dialogRef.close(createdLesson);
      });
      location.reload();
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
