import { Component, OnInit } from '@angular/core';
import { LessonScheduleService } from './lessonsSchedule-service/lessonsSchedule.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { Semester } from 'src/app/interfaces/semester-interface';
import { Time } from '@angular/common';

@Component({
  selector: 'app-lessons-schedule',
  templateUrl: './lessonsSchedule.component.html',
  styleUrls: ['./lessonsSchedule.component.css']
})
export class LessonsScheduleComponent implements OnInit {
  // lessons!: any[]; 
  groupId: number = 0;

  lessons: any[] = [];
  lessonsByDay: { [dayName: string]: any[] } = {}; // Używamy obiektu do przechowywania lekcji dla każdego dnia


  constructor(private lessonsScheduleService: LessonScheduleService, private loginService: LoginService) { }

  ngOnInit(): void {
    const token = this.loginService.getToken();
      const _token = token.split('.')[1];
      const _atobData = atob(_token);
      const _finalData = JSON.parse(_atobData); 


      if (_finalData.id.classGroup) {
        this.groupId = _finalData.id.classGroup.id;
      } else if (_finalData.id.teachingClassGroups && _finalData.id.teachingClassGroups.length > 0) {
        // Szukaj teachingClassGroup przypisanego do zalogowanego użytkownika
        const userTeachingClassGroup = _finalData.id.teachingClassGroups.find(
          (teachingClassGroup: any) => teachingClassGroup.userId === _finalData.id
        );
  
        if (userTeachingClassGroup) {
          this.groupId = userTeachingClassGroup.groupId;
        } else {
          this.groupId = _finalData.id.teachingClassGroups[0].groupId;
        }
      }
      

    // console.log(_finalData.id);
    // console.log(this.groupId);
    // this.lessonsScheduleService.findByClassGroupOrTeachingClassGroups(this.groupId, _finalData.id)
    // .subscribe((lessons: any) => {
    //   this.lessons = lessons;
    // });


    this.lessonsScheduleService.findByClassGroupOrTeachingClassGroups(_finalData.id)
      .subscribe((lessons: any) => {
        this.lessons = lessons;
        console.log('Lessons:', this.lessons);

        this.lessons.sort((a, b) => {
          const dayOrder = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];
          const dayA = dayOrder.indexOf(a.dayName);
          const dayB = dayOrder.indexOf(b.dayName);

          if (dayA !== dayB) {
            return dayA - dayB;
          }

          const timeA = new Date(`1970-01-01T${a.startLessonTime}`);
          const timeB = new Date(`1970-01-01T${b.startLessonTime}`);
          return timeA.getTime() - timeB.getTime();
        });

        
      });


      // const storedColors = localStorage.getItem('courseColors');
      // if (storedColors) {
      //   this.courseColors = JSON.parse(storedColors);
      // }


      

    }

    getLessonByDayName(dayName: string): any[] {
      return this.lessons.filter(lesson => lesson.dayName === dayName);
    }

    getLessonsDayNames(): string[] {
      const uniqueYearBooks = [...new Set(this.lessons.map(lesson => lesson.dayName))];
      // console.log('lekcje', this.lessons);
      return uniqueYearBooks;
    }






      
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
    
  }
