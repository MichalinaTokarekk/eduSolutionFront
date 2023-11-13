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


    }

    getLessonByDayName(dayName: string): any[] {
      return this.lessons.filter(lesson => lesson.dayName === dayName);
    }

    getLessonsDayNames(): string[] {
      const uniqueYearBooks = [...new Set(this.lessons.map(lesson => lesson.dayName))];
      // console.log('lekcje', this.lessons);
      return uniqueYearBooks;
    }
      

    



    getLessonsByDayAndHour(dayName: string, hour: number): any[] {
      return this.lessons.filter(lesson => 
        lesson.dayName === dayName &&
        this.getHourFromTime(lesson.startLessonTime) <= hour &&
        this.getHourFromTime(lesson.endLessonTime) > hour
      );
    }
    
    getHourFromTime(time: Time): number {
      return time && time.hours !== undefined ? time.hours : 0;
    }

    getHoursArray(): number[] {
      const hoursArray: number[] = [];
      for (let i = 8; i <= 18; i++) {
        hoursArray.push(i);
      }
      return hoursArray;
    }

    convertTimeStringToDate(timeString: string): Date {
      const [hours, minutes] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      return date;
    }

    getCourseName(course: any): string {
      return course ? course.name : 'Brak kursu';
    }

    getClassGroupName(classGroup: any): string {
      return classGroup ? classGroup.name : 'Brak grupy';
    }

    
    isLessonStartingAtHour(lesson: any, hour: number): boolean {
      const lessonStartTime = new Date(lesson.startLessonTime);
      return lessonStartTime.getHours() === hour;
    }
    
    
    
    
      
      
    
    
    
      
    
  }
