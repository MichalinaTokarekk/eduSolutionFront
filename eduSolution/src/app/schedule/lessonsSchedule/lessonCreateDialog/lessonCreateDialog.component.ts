import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LessonScheduleService } from '../lessonsSchedule-service/lessonsSchedule.service';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';

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
    private lessonService: LessonScheduleService, private classGroupService: ClassGroupService
  ) {
    
    this.loadData(); 
    this.lessonForm = this.formBuilder.group({
      name: ['', Validators.required],
      dayName: ['', Validators.required],
      startLessonTime: ['', Validators.required],
      endLessonTime: ['', Validators.required],
      dates: ['', Validators.required],
      classGroupId: [null, Validators.required] // Domyślnie null
    });
    
  }

  loadData(): void {
    this.classGroupService.getAll().subscribe(
      (data) => {
        this.classGroups = data || [];
      },
      (error) => {
        console.error('Błąd podczas pobierania danych z classGroupService:', error);
      }
    );
  }

  updateDates(event: any): void {
    const datesString = this.lessonForm.get('dates')?.value;
    const datesArray = datesString.split(',').map((date: string) => date.trim());

    this.lessonForm.patchValue({
      dates: datesArray
    });
  }

onCreateClick(): void {
    if (this.lessonForm.valid) {
      const newLesson = this.lessonForm.value;

      // Konwersja courseId i classGroupId na liczby
      newLesson.classGroupId = parseInt(newLesson.classGroupId, 10);
      // newLesson.classGroupId = newLesson.classGroupId;


      // Ręczne przypisanie obiektu course

      console.log('newLesson.classGroupId:', newLesson.classGroupId);
      const selectedClassGroup = this.classGroups.find(classGroup => classGroup.id === newLesson.classGroupId);
      console.log('selectedClassGroup:', selectedClassGroup);
      newLesson.classGroup = selectedClassGroup;



      console.log('newLesson before save:', newLesson);

      this.lessonService.save(newLesson).subscribe(
        (createdLesson) => {
          console.log('createdLesson:', createdLesson);
          this.dialogRef.close(createdLesson);
        },
        (error) => {
          console.error('Błąd podczas zapisywania lekcji:', error);
        }
      );
      
      location.reload();
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
