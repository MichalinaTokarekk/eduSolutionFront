import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnswerService } from '../answer-service/answer.service';

@Component({
  selector: 'app-answer-detail',
  template: `
    <h2>Odpowiedź: <p>{{ data.answer.user.firstName }} {{data.answer.user.lastName }} </p></h2>
    <p>{{ data.answer.answerContent }}</p>
    <input [(ngModel)]="editedComment" placeholder="Edytuj komentarz">
    <input [(ngModel)]="editedAnswerStatus" placeholder="Edytuj status odpowiedzi">
    <button (click)="updateAnswerDetails()">Zapisz zmiany</button>
  `,
})
    export class AnswerDetailComponent implements OnInit{
        editedComment: string;
        editedAnswerStatus: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AnswerDetailComponent>, private answerService: AnswerService) {
        this.editedComment = data.answer.comment;
        this.editedAnswerStatus = data.answer.answerStatus;
    }


    ngOnInit(): void {
        this.updateAnswerDetails();
    }

    updateAnswerDetails() {
        this.answerService.save(this.data.answer).subscribe(updatedAnswer => {
            console.log('Odpowiedź została zaktualizowana.');
          }, error => {
            console.error('Błąd podczas aktualizacji odpowiedzi:', error);
          });
    }
      

}

