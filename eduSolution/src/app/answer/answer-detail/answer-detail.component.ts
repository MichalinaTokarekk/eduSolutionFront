import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnswerService } from '../answer-service/answer.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AFileService } from 'src/app/aFile/aFile-service/aFile.service';
import { HomeworkTestService } from 'src/app/homeworkTest/homeworkTest-service/homeworkTest.service';
import { HTFileService } from 'src/app/htFile/htFile-service/htFile.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { GradeService } from 'src/app/grade/grade-service/grade.service';
import { TypeOfTestingKnowledge } from 'src/app/interfaces/typeOfTestingKnowledge-interface';
import { TypeOfTestingKnowledgeService } from 'src/app/typeOfTestingKnowledge/typeOfTestingKnowledge-service/typeOfTestingKnowledge.service';

@Component({
  selector: 'app-answer-detail',
  template: `
  <div class="answer-detail-container" style="max-height: 500px; overflow: auto;">
    <h2>Odpowiedź: <p>{{ data.answer.user.firstName }} {{data.answer.user.lastName }} </p></h2>
    <!-- <p>{{ data.answer.answerContent }}</p> -->
    <div class="answer-content">
      {{ data.answer.answerContent }}
    </div>
     <!-- Wyświetlanie plików do odpowiedzi -->
    <div *ngFor="let aFile of aFilesByAnswer" (click)="loadAFilesByAnswerId(data.answer.id)">
      <a (click)="downloadFileById(aFile.id)" href="javascript:void(0);">{{ aFile.name }}</a>
    </div>
    <p>Utworzono: {{ data.answer.createdAt | date:'yyyy-MM-dd HH:mm:ss' }}</p>
    <p>Ostatnia modyfikacja: {{ data.answer.updatedAt | date:'yyyy-MM-dd HH:mm:ss' }}</p>
    <div [ngClass]="{'green-background': calculateTimeDifference().beforeDeadline, 'red-background': !calculateTimeDifference().beforeDeadline}">
        <p>
          {{ calculateTimeDifference().beforeDeadline ? 'Zadanie zostało przesłane ' : 'Zadanie zostało przesłane ' }}
          {{ calculateTimeDifference().days }} dni, {{ calculateTimeDifference().hours }} godzin i {{ calculateTimeDifference().minutes }} minut
          {{ calculateTimeDifference().beforeDeadline ? 'przed terminem.' : 'po terminie.' }}
        </p>
        </div>

    <input [(ngModel)]="editedComment" name="editedComment" placeholder="Edytuj komentarz">
    <input [(ngModel)]="editedAnswerStatus" name="editedAnswerStatus" placeholder="Edytuj status odpowiedzi">

    <div *ngIf="!hasGrade" class="grade-input">
    <div class="input-field">
      <input class="value-input" [(ngModel)]="newValue" name="newValue" type="number" placeholder="Wartość oceny" required>
    </div>
    <div class="input-field">
      <input class="description-input" [(ngModel)]="newDescription" name="newDescription" type="text" placeholder="Opis oceny">
    </div>
    <div class="input-field">
      <mat-select class="knowledge-select" [(ngModel)]="selectedKnowledge" name="knowledge" placeholder="Wybierz rodzaj oceny">
        <mat-option *ngFor="let knowledge of allKnowledge" [value]="knowledge.id">{{ knowledge.name }}</mat-option>
      </mat-select>
    </div>
    <button class="add-button" (click)="addNewGrade()">Dodaj ocenę</button>
  </div>

  <div *ngIf="hasGrade">
        <!-- Wyświetl informacje o istniejącej ocenie -->
        <p>Ocena: {{ existingGrade.value }}</p>
        <p>Opis oceny: {{ existingGrade.description }}</p>
        <button (click)="startEditing()">Edytuj ocenę</button>
        <button (click)="deleteGrade()" style="margin-left: 5px;">Usuń ocenę</button>


<!-- Formularz edycji oceny -->
<div *ngIf="isEditing" class="grade-input">
  <div class="input-field">
    <input [(ngModel)]="editedGrade.value" name="editedValue" type="number" placeholder="Wartość oceny" required>
  </div>
  <div class="input-field">
    <input [(ngModel)]="editedGrade.description" name="editedDescription" type="text" placeholder="Opis oceny">
  </div>
  <!-- ... inne pola do edycji -->

  <button (click)="saveEditedGrade()">Zapisz edycję</button>
  <button (click)="cancelEditing()">Anuluj edycję</button>
</div>
      </div>

  
    <button (click)="updateAnswerDetails()" style="margin-top: 10px;">Zapisz zmiany</button>   
  </div>
  `,
  styles: [`
  .answer-content {
  font-size: 18px; /* Rozmiar czcionki */
  padding: 10px; /* Wewnętrzne wypełnienie */
  border: 1px solid #ccc; /* Obramowanie */
  max-width: 100%; /* Maksymalna szerokość */
  height: 200px; /* Wysokość obszaru tekstowego */
  overflow-y: scroll; /* Pasek przewijania, jeśli tekst jest dłuższy niż obszar */
}

  .answer-detail-container {
    padding: 20px; /* Dodanie wewnętrznych marginesów dla kontenera */
  }
  h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  p {
    font-size: 18px;
  }
  input {
    width: 100%;
    padding: 5px;
    margin: 5px 0; /* zmniejszenie marginesu od góry i dołu */
    max-width: 346px; /* ograniczenie maksymalnej szerokości inputów */
  }
  button {
    background-color: #007bff;
    color: #fff;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }

  .green-background {
  background-color: rgb(153, 206, 153);
}

.red-background {
  background-color: rgb(196, 144, 144);
}

`]
})
    export class AnswerDetailComponent implements OnInit{
      // @Input() aFilesByAnswer!: any[];
      editedComment: string;
      editedAnswerStatus: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AnswerDetailComponent>, private answerService: AnswerService, private router: Router,
                        private route: ActivatedRoute, private aFileService: AFileService, private homeworkTestService: HomeworkTestService, private htFileService: HTFileService,
                        private loginService: LoginService, private gradeService: GradeService, private typeOfTestingKnowledgeService: TypeOfTestingKnowledgeService) {
        this.editedComment = data.answer.comment;
        this.editedAnswerStatus = data.answer.answerStatus;
        console.log(data.answer.id);
        this.loadAFilesByAnswerId(data.answer.id);
    }
    homeworkTest: any = {};
    htFiles!: any[]; 
    answer!: any; 
    allKnowledge: TypeOfTestingKnowledge[] = [];
    newValue!: number;
    hasGrade: boolean = false; // Ustaw na true, jeśli odpowiedź ma przypisaną ocenę
    existingGrade: any; 
    editedGrade: any = null;


    ngOnInit(): void {
        // this.updateAnswerDetails();
        this.typeOfTestingKnowledgeService.getAll().subscribe((knowledge: TypeOfTestingKnowledge[]) => {
          this.allKnowledge = knowledge;
      });

      this.gradeService.getGradeByAnswerId(this.data.answer.id).subscribe((grade: any) => {
        if (grade) {
          this.hasGrade = true;
          this.existingGrade = grade;
          this.editedGrade = { ...grade };
        }
      });
      
      
    }

    aFilesByAnswer!: any;
    loadAFilesByAnswerId(answerId: string): void {
      this.aFileService.aFilesByAnswerId(answerId).subscribe(aFiles => {
          this.aFilesByAnswer = aFiles;
        });
    }
    

    updateAnswerDetails() {
      this.data.answer.comment = this.editedComment;
      this.data.answer.answerStatus = this.editedAnswerStatus;
     
        this.answerService.updateAnswer(this.data.answer).subscribe(updatedAnswer => {
            console.log('Odpowiedź została zaktualizowana.');
            console.log('editedComment:', this.editedComment);
            console.log('editedAnswerStatus:', this.editedAnswerStatus);
          }, error => {
            console.error('Błąd podczas aktualizacji odpowiedzi:', error);
          });
          location.reload();

          
    }
      
    downloadFileById(fileId: number): void {
      this.aFileService.downloadFileById(fileId).subscribe((blob: Blob) => {
        // Tworzymy link do pobierania pliku
  
      
        const contentType  = blob.type;
      
        let fileName = `${fileId}.pdf`;
    
        if (contentType) {
          // Sprawdzenie, czy Content-Type wskazuje na plik PDF
          if (contentType === 'application/pdf') {
            fileName = `${fileId}.pdf`;
          } else if (contentType === 'image/png') {
            // Jeśli to obraz PNG, nadaj rozszerzenie .png
            fileName = `${fileId}.png`;
          } else {
            // Obsłuż inne typy plików i nadaj odpowiednie rozszerzenia
            // np. contentType === 'image/jpeg' dla obrazów JPEG
          }
        }
  
  
        const url = window.URL.createObjectURL(blob);
    
        // Tworzymy element <a> i nadajemy mu atrybuty, aby otworzyć pobrany plik w nowej karcie
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = fileName; // Zmień nazwę pliku na coś sensownego lub korzystając z informacji o pliku
    
        // Klikamy na ten element, aby rozpocząć pobieranie pliku
        a.click();
    
        // Po pobraniu pliku usuwamy link i element <a>
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, error => {
        console.error('Błąd podczas pobierania pliku', error);
      });
    }

    calculateTimeDifference(): { days: number, hours: number, minutes: number, beforeDeadline: boolean } {
      const updatedAtDate = new Date(this.data.answer.updatedAt);
      const deadlineDate = new Date(this.data.homeworkTest.deadline);
      
      const timeDifference = deadlineDate.getTime() - updatedAtDate.getTime();
      const beforeDeadline = timeDifference > 0;
    
      const totalMinutesDifference = Math.abs(Math.floor(timeDifference / (1000 * 60)));
      const daysDifference = Math.floor(totalMinutesDifference / (24 * 60));
      const hoursDifference = Math.floor((totalMinutesDifference % (24 * 60)) / 60);
      const minutesDifference = totalMinutesDifference % 60;
    
      return { days: daysDifference, hours: hoursDifference, minutes: minutesDifference, beforeDeadline };
    }
    
    
    editedGradeValue!: number;
    selectedKnowledge: TypeOfTestingKnowledge[] = [];
    // selectedKnowledge!: TypeOfTestingKnowledge;

    newDescription!: string;


    addNewGrade() {
      const token = this.loginService.getToken();
      const _token = token.split('.')[1];
      const _atobData = atob(_token);
      const _finalData = JSON.parse(_atobData);

      // Utwórz nowy obiekt oceny z odpowiednimi wartościami
      const newGrade = {
        value: this.newValue,
        isFinalValue: false, // Może być false, jeśli to nie jest ostateczna ocena
        description:  this.newDescription,
        student: this.data.answer.user,
        teacher: _finalData.id,
        typeOfTestingKnowledge: this.selectedKnowledge,
        // semester,
        course: this.data.courseId,
        answer: this.data.answer // Przypisz ocenę do odpowiedzi, w której jesteś
      };
    
      // Wykorzystaj gradeService do dodania oceny do bazy danych
      this.gradeService.save(newGrade).subscribe(addedGrade => {
        console.log('Nowa ocena została dodana do bazy danych.');
      
        location.reload();
      }, error => {
        console.error('Błąd podczas dodawania nowej oceny:', error);
        console.error('course', this.data.courseId);
      });
    }
    
    editGrade() {
      if (this.editedGrade) {
        this.gradeService.updateGrade(this.editedGrade).subscribe((updatedGrade: any) => {
          console.log('Ocena została zaktualizowana.');
          // Możesz zaktualizować widok lub wykonać inne akcje po aktualizacji oceny
        });
        location.reload();
      }
    }
  
    deleteGrade() {
      if (this.existingGrade) {
        this.gradeService.remove(this.existingGrade.id).subscribe(() => {
          console.log('Ocena została usunięta.');
          this.hasGrade = false; // Ustaw, że nie ma oceny
          this.existingGrade = null; // Wyczyść istniejącą ocenę
        });
        location.reload();
      }
    }

    isEditing: boolean = false; // Czy edycja jest włączona

    startEditing() {
      this.isEditing = true;
      // Skopiuj istniejącą ocenę do edytowanej oceny
      this.editedGrade = { ...this.existingGrade };
    }

    cancelEditing() {
      this.isEditing = false;
      // Możesz przywrócić pierwotne wartości pól, jeśli użytkownik anuluje edycję
    }

    saveEditedGrade() {
      if (this.editedGrade) {
        this.gradeService.updateGrade(this.editedGrade).subscribe((updatedGrade: any) => {
          console.log('Ocena została zaktualizowana.');
          this.isEditing = false; // Wyłącz tryb edycji
          // Możesz zaktualizować widok lub wykonać inne akcje po zapisaniu edycji
        });
        location.reload();
      }
    }

}

