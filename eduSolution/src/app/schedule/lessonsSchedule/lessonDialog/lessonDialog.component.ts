import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LessonScheduleService } from '../lessonsSchedule-service/lessonsSchedule.service';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';

@Component({
  selector: 'app-lesson-dialog',
  templateUrl: './lessonDialog.component.html',
  styleUrls: ['./lessonDialog.component.css']
})
export class LessonDialogComponent {
  editedLesson: any;
  editedLessonForm: FormGroup;
  classGroups: any[] = [];
  userRole!: string;

  constructor(
    public dialogRef: MatDialogRef<LessonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private lessonService: LessonScheduleService, private classGroupService: ClassGroupService, private loginService: LoginService
  ) {
    // Sprawdź, czy data.lesson istnieje, a jeśli nie, zainicjalizuj pusty obiekt
    this.editedLesson = data.lesson || {};
    
    this.loadData(); 
    this.editedLessonForm = this.formBuilder.group({
      name: [this.editedLesson?.name || '', Validators.required],
      dayName: [this.editedLesson?.dayName || '', Validators.required],
      startLessonTime: [this.editedLesson?.startLessonTime || '', Validators.required],
      endLessonTime: [this.editedLesson?.endLessonTime || '', Validators.required],
      dates: [this.editedLesson?.dates || '', Validators.required],
      classGroup: [this.editedLesson?.classGroup ? this.editedLesson.classGroup.id : null],
    });
    this.extractUserRole();

    
  }

  loadData(): void {
    this.classGroupService.getAll().subscribe(
      (data) => {
        this.classGroups = data || [];
        // console.log('editedLesson.classGroup.name', this.editedLesson.classGroup.name);

      },
      (error) => {
        console.error('Błąd podczas pobierania danych z classGroupService:', error);
      }
    );
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
    location.reload();
  }

  onDeleteClick(): void {
    const lessonId = this.editedLesson.id;
  
    if (lessonId) {
      this.lessonService.remove(lessonId).subscribe(() => {
        this.dialogRef.close();
      });
    }
    location.reload();
}

// Dodaj do klasy LessonDialogComponent
updateDates(event: any): void {
  const datesString = this.editedLessonForm.get('dates')?.value;
  const datesArray = datesString.split(',').map((date: string) => date.trim());

  this.editedLessonForm.patchValue({
    dates: datesArray
  });
}

extractUserRole() {
  const token = this.loginService.getToken();
  
  if (token) {
    const _token = token.split('.')[1];
    const _atobData = atob(_token);
    const _finalData = JSON.parse(_atobData);
    
    // Zakładając, że rola znajduje się w polu 'role' obiektu danych
    this.userRole = _finalData.role;
    console.log('role', this.userRole);
  }
}

getClassName(): string {
  return this.classGroups.find(group => group.id === this.editedLesson.classGroup)?.name || '';
}

isUser(): boolean {
  return this.userRole === 'user';
}




}
