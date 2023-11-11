// yearBookUserDetails.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GradeService } from '../grade/grade-service/grade.service';
import { AnswerService } from '../answer/answer-service/answer.service';
import { Answer } from '../interfaces/answer-interface';
import { AnswerDetailComponent } from '../answer/answer-detail/answer-detail.component';
import { AFileService } from '../aFile/aFile-service/aFile.service';
import { MatDialog } from '@angular/material/dialog';
import { ArchivedAnswerDetailComponent } from './archivedAnswerDetail.component';

@Component({
  selector: 'archives-homeworkTest',
  templateUrl: './archivesHomeworkTest.component.html',
  styleUrls: ['./archivesHomeworkTest.component.css'] // Możesz dostosować ścieżkę do stylów CSS
})
export class ArchivesHomeworkTestComponent implements OnInit {
  homeworkTestId!: number;
  userGrades!: any[]; // Dostosuj typ danych w zależności od struktury ocen
userGradesBySemesterAndCourse: { semester: string; courses: { course: string; grades: any[] }[] }[] = [];


  grades!: any[];
  userName: string = '';
  answersByHomeworkTest: any = {};
  answerDetailComponent!: AnswerDetailComponent;
  homeworkTest: any = {};
  private courseId!: number;

  constructor(private route: ActivatedRoute, private gradeService: GradeService, private answerService: AnswerService, private aFileService: AFileService,
    private dialog: MatDialog, ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.homeworkTestId = +params['id'];
      this.loadAnswersInHomeworkTest();
    });
  }


private loadAnswersInHomeworkTest() {
    this.gradeService.findAllByStudentId(this.homeworkTestId).subscribe(data => {
      this.userGrades = data as any[];
      this.processUserGrades();
    });
  }

    processUserGrades() {
    this.answerService.findByHomeworkTest(this.homeworkTestId).subscribe(answersByHomeworkTest => {
        this.answersByHomeworkTest = answersByHomeworkTest;
        console.log('odpowiedzi ', this.answersByHomeworkTest);
      }, error => {
        console.error('Błąd podczas pobierania klas użytkownika:', error);
        console.log('homeworkTestId', this.homeworkTestId);
      });
  }

  aFilesByAnswer!: any;
  loadAFilesByAnswerId(answerId: string): void {
    this.aFileService.aFilesByAnswerId(answerId).subscribe(aFiles => {
        this.aFilesByAnswer = aFiles;
      });
  }

  openAnswerDetailsDialog(answer: Answer): void {
    const dialogRef = this.dialog.open(ArchivedAnswerDetailComponent, {
      width: '400px', // dostosuj szerokość do swoich potrzeb
      data: { answer, aFilesByAnswer: this.aFilesByAnswer, homeworkTest: this.homeworkTest, courseId: this.courseId}, // przekaż odpowiedź jako dane
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Tutaj możesz obsłużyć akcje po zamknięciu dialogu, jeśli jest to konieczne
      if (result === 'saved') {
        this.answerDetailComponent.updateAnswerDetails();
      }
    });
  }

  getUniqueYearBooks(): number[] {
    // Utwórz tablicę unikalnych roczników na podstawie dostępnych odpowiedzi
    const uniqueYearBooks: number[] = [];
  
    if (this.answersByHomeworkTest) {
      this.answersByHomeworkTest.forEach((answer: any) => {
        if (answer && answer.user && answer.user.yearBook && !uniqueYearBooks.includes(answer.user.yearBook)) {
          uniqueYearBooks.push(answer.user.yearBook);
        }
      });
    }
  
    return uniqueYearBooks;
  }
  
  
}
