import { Component, OnInit } from '@angular/core';
import { LessonScheduleService } from './lessonsSchedule-service/lessonsSchedule.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { Semester } from 'src/app/interfaces/semester-interface';
import { Time } from '@angular/common';
import { Lesson } from 'src/app/interfaces/lesson-interface';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { CourseService } from 'src/app/course/course-service/course.service';
import { MatDialog } from '@angular/material/dialog';
import { LessonDialogComponent } from './lessonDialog/lessonDialog.component';
import { LessonCreateDialogComponent } from './lessonCreateDialog/lessonCreateDialog.component';

@Component({
  selector: 'app-lessons-schedule',
  templateUrl: './lessonsSchedule.component.html',
  styleUrls: ['./lessonsSchedule.component.css']
})
export class LessonsScheduleComponent implements OnInit {
  // lessons!: any[]; 
  groupId: number = 0;

  lessons: any[] = [];
  lessonsByClassGroup!: Map<string, any[]>;


  constructor(private lessonsScheduleService: LessonScheduleService, private loginService: LoginService, private classGroupService: ClassGroupService, 
    private courseService: CourseService,  private dialog: MatDialog) { }

  ngOnInit(): void {
    const token = this.loginService.getToken();
      const _token = token.split('.')[1];
      const _atobData = atob(_token);
      const _finalData = JSON.parse(_atobData); 
      this.lessonsByClassGroup = new Map<string, any[]>(); // Mapa do przechowywania lekcji dla każdej klasy



      this.lessonsScheduleService.getAllWeekDays().subscribe((weekDays: any) => {
        this.weekDays = weekDays;
      });

      this.lessonsScheduleService.findLessonsForUserInClassGroups(_finalData.id).subscribe((lessons) => {
        this.lessons = lessons;
        console.log('Lessons:', this.lessons);

        this.lessons.forEach((lesson: any) => {
          const classGroup = lesson.classGroupName || 'Unknown';
        
          if (!lesson.classGroupName) {
            console.log('Lesson with undefined classGroupName:', lesson);
          }
        
          if (this.lessonsByClassGroup.has(classGroup)) {
            const classLessons = this.lessonsByClassGroup.get(classGroup);
            if (classLessons) {
              classLessons.push(lesson);
            }
          } else {
            this.lessonsByClassGroup.set(classGroup, [lesson]);
          }
        });
        
        console.log('Lessons with undefined classGroupName:', this.lessons.filter(lesson => !lesson.classGroupName));
        console.log('Lessons:', this.lessonsByClassGroup);
        
        
        
      });
      

    }
    timeSlot: string = '';
    timeSlots: string[] = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
    // timeSlots: string[] = ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'];


isLessonInTimeSlot(lesson: any, timeSlot: string): boolean {
  const [startHour, startMinute] = lesson.startLessonTime.split(':');
  const [endHour, endMinute] = lesson.endLessonTime.split(':');
  const [slotHour, slotMinute] = timeSlot.split(':');

  const lessonStart = new Date(0, 0, 0, +startHour, +startMinute);
  const lessonEnd = new Date(0, 0, 0, +endHour, +endMinute);
  const slotTime = new Date(0, 0, 0, +slotHour, +slotMinute);

  return lessonStart <= slotTime && slotTime < lessonEnd;
}







    //KOLORY LEKCJI 

      
    courseColors: { [classGroupId: number]: string } = {};
    // courseColors: { [classGroupId: number]: string } = {
    //   1: '#000000', 
    //   2: '#ffffff', 
    // };

    getCourseColor(classGroupId: number): string {
      // Sprawdź, czy kolor jest już przypisany do danej classGroup
      if (!this.courseColors[classGroupId]) {
        // Jeżeli nie, przypisz nowy kolor
        this.courseColors[classGroupId] = this.getFixedColor();
        // Zapisz kolory w pamięci lokalnej przeglądarki
        localStorage.setItem('courseColors', JSON.stringify(this.courseColors));
      }
    
      return this.courseColors[classGroupId];
    }

    counter: number = 0;
    
    getFixedColor(): string {
      const colors = ['#ADD8E6', '#D2B48C', '#90EE90']; // Tutaj możesz zdefiniować swoje trzy kolory
      // Dla przykładu, możesz użyć modulo, aby wybierać kolory cyklicznie
      const index = this.counter % colors.length;
      this.counter++; // Zakładając, że masz pole `counter` na poziomie klasy, zainicjowane na początku jako 0.
      return colors[index];
    }
    
    


    
    // getRandomColor(): string {
    //   const letters = '0123456789ABCDEF';
    //   let color = '#';
    //   for (let i = 0; i < 6; i++) {
    //     color += letters[Math.floor(Math.random() * 16)];
    //   }
    //   return color;
    // }

    isCourseGrouped(classGroupId: number): boolean {
      return this.lessons.filter(lesson => lesson.classGroup.id === classGroupId).length > 1;
    }

    getSemesterName(): string {
      // Przyjmując, że semestr jest zawsze taki sam dla wszystkich lekcji
      if (this.lessons.length > 0) {
        return this.lessons[0].classGroup.semester.name;
      }
    
      // Jeśli nie ma lekcji, możesz zwrócić domyślną wartość lub pusty string
      return 'Brak danych o semestrze';
    }


    //EDYCJA

    classGroups: any[] = [];
    courses: any[] = [];
    weekDays: any[] = [];

    openEditLessonDialog(lesson: any): void {
      const dialogRef = this.dialog.open(LessonDialogComponent, {
        width: '400px',
        data: { lesson, classGroups: this.classGroups, courses: this.courses },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // Tutaj możesz obsługiwać zapisane zmiany
          console.log('Zapisano zmiany:', result);
  
          // Aktualizuj lekcję w tablicy lessons po zapisaniu zmian
          const index = this.lessons.findIndex((l) => l.id === result.id);
          if (index !== -1) {
            this.lessons[index] = result;
          }
        }
      });
    }

    openAddLessonDetailDialog(): void {
      const dialogRef = this.dialog.open(LessonCreateDialogComponent, {
        width: '400px',
        data: { lesson: {}, classGroups: this.classGroups, courses: this.courses },
      });
    
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // Tutaj możesz obsługiwać zapisane zmiany
          console.log('Zapisano nowe szczegóły lekcji:', result);
        }
      });
    }
    
    
    
    
  }
