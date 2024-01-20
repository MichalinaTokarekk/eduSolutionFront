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
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-answer-detail',
  templateUrl: './answer-detail.component.html',
  styleUrls: ['./answer-detail.component.css']
})
    export class AnswerDetailComponent implements OnInit{
      // @Input() aFilesByAnswer!: any[];
      editedComment: string;
      editedAnswerStatus: string;

      constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AnswerDetailComponent>, private answerService: AnswerService, private router: Router,
      private route: ActivatedRoute, private aFileService: AFileService, private homeworkTestService: HomeworkTestService, private htFileService: HTFileService,
      private loginService: LoginService, private gradeService: GradeService, private typeOfTestingKnowledgeService: TypeOfTestingKnowledgeService, private snackBar: MatSnackBar) {
      this.editedComment = data.answer?.comment || ''; // Dodano sprawdzenie, czy data.answer jest zdefiniowane
      this.editedAnswerStatus = data.answer?.answerStatus || '';

      if(data.answer.user) {
        this.loadAFilesByAnswerId(data.answer.id);
      }
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

      if(this.data.answer.user) {
        this.gradeService.getGradeByAnswerId(this.data.answer.id).subscribe((grade: any) => {
          if (grade) {
            this.hasGrade = true;
            this.existingGrade = grade;
            this.editedGrade = { ...grade };
          }
        });
    }
      
      
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
      const previousUpdatedAt = this.data.answer.updatedAt;
        this.answerService.updateAnswer(this.data.answer).subscribe(updatedAnswer => {
            console.log('Odpowiedź została zaktualizowana.');
            console.log('editedComment:', this.editedComment);
            console.log('editedAnswerStatus:', this.editedAnswerStatus);
            this.data.answer.updatedAt = previousUpdatedAt;
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
      const updatedAtDate = new Date(this.data.answer.createdAt);
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
        isFinalValue: false, 
        description:  this.newDescription,
        student: this.data.answer.user,
        teacher: _finalData.id,
        typeOfTestingKnowledge: this.selectedKnowledge,
        classGroup: this.data.classGroupId,
        answer: this.data.answer 
      };
    
      this.gradeService.save(newGrade).subscribe(addedGrade => {
        console.log('Nowa ocena została dodana do bazy danych.');
      
        location.reload();
      }, error => {
        console.error('Błąd podczas dodawania nowej oceny:', error);
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


    openSnackBar() {
      this.snackBar.open('Brak odpowiedzi dla tego użytkownika i zadania.', 'Zamknij', {
        duration: 3000, // czas wyświetlania snackbara w milisekundach
      });
  }
  
}

