// yearBookUserDetails.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GradeService } from '../grade/grade-service/grade.service';

@Component({
  selector: 'app-year-book-user-details',
  templateUrl: './yearBookUserDetails.component.html',
  styleUrls: ['./yearBookUserDetails.component.css'] // Możesz dostosować ścieżkę do stylów CSS
})
export class YearBookUserDetailsComponent implements OnInit {
  userId!: number;
  userGrades!: any[]; // Dostosuj typ danych w zależności od struktury ocen
//   userGradesBySemester: { semester: string; grades: any[] }[] = [];
userGradesBySemesterAndCourse: { semester: string; courses: { course: string; grades: any[] }[] }[] = [];


  grades!: any[];
  userName: string = '';


  constructor(private route: ActivatedRoute, private gradeService: GradeService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      this.loadUserGrades();
    });
  }

//   loadUserGrades() {
//     this.gradeService.findAllByStudentId(this.userId).subscribe(data => {
//       this.userGrades = data as any[]; // Dodaj rzutowanie do any[]
//       this.processUserGrades(); // Nowa metoda do przetwarzania danych
//     });
//   }

//   private processUserGrades() {
//     const groupedGrades: { [key: string]: any[] } = {};

//     this.userGrades.forEach(grade => {
//       const semester = grade.semester.name;
//       if (!groupedGrades[semester]) {
//         groupedGrades[semester] = [];
//       }
//       groupedGrades[semester].push(grade);
//     });

//     this.userGradesBySemester = Object.keys(groupedGrades).map(key => ({ semester: key, grades: groupedGrades[key] }));

//     this.userName = `${this.userGrades[0].student.firstName} ${this.userGrades[0].student.lastName}`;

//   }


private loadUserGrades() {
    this.gradeService.findAllByStudentId(this.userId).subscribe(data => {
      this.userGrades = data as any[];
      this.processUserGrades();
    });
  }

  private processUserGrades() {
    const groupedGrades: { [key: string]: { [key: string]: any[] } } = {};

    this.userGrades.forEach(grade => {
      const semester = grade.semester.name;
      const course = grade.course.name;

      if (!groupedGrades[semester]) {
        groupedGrades[semester] = {};
      }

      if (!groupedGrades[semester][course]) {
        groupedGrades[semester][course] = [];
      }

      groupedGrades[semester][course].push(grade);
    });

    this.userGradesBySemesterAndCourse = Object.keys(groupedGrades).map(semester => {
      const courses = Object.keys(groupedGrades[semester]).map(course => ({
        course: course,
        grades: groupedGrades[semester][course]
      }));

      return { semester: semester, courses: courses };
    });

    if (this.userGrades.length > 0) {
      const student = this.userGrades[0].student;
      this.userName = `${student.firstName} ${student.lastName}`;
    }
  }
  
  
}
