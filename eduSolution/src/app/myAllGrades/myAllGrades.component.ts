// yearBookUserDetails.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GradeService } from '../grade/grade-service/grade.service';
import { LoginService } from '../authorization_authentication/service/login.service';

@Component({
  selector: 'my-all-grades',
  templateUrl: './myAllGrades.component.html',
  styleUrls: ['./myAllGrades.component.css'] // Możesz dostosować ścieżkę do stylów CSS
})
export class MyAllGradesComponent implements OnInit {
  userId!: number;
  userGrades!: any[]; 
userGradesBySemesterAndCourse: { semester: string; courses: { course: string; grades: any[] }[] }[] = [];


  grades!: any[];
  userName: string = '';


  constructor(private route: ActivatedRoute, private gradeService: GradeService, private loginService: LoginService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      this.loadUserGrades();
    });
  }

private loadUserGrades() {
    const token = this.loginService.getToken();
        const _token = token.split('.')[1];
        const _atobData = atob(_token);
        const _finalData = JSON.parse(_atobData);
    this.gradeService.findAllByStudentId(_finalData.id).subscribe(data => {
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
