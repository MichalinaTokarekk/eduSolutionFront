import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AFileService } from 'src/app/aFile/aFile-service/aFile.service';
import { HomeworkTestService } from 'src/app/homeworkTest/homeworkTest-service/homeworkTest.service';
import { HTFileService } from 'src/app/htFile/htFile-service/htFile.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { GradeService } from '../grade-service/grade.service';
import { TypeOfTestingKnowledge } from 'src/app/interfaces/typeOfTestingKnowledge-interface';
import { Grade } from 'src/app/interfaces/grade-interface';
import { TypeOfTestingKnowledgeService } from 'src/app/typeOfTestingKnowledge/typeOfTestingKnowledge-service/typeOfTestingKnowledge.service';
import { CertificateConfirmation } from 'src/app/interfaces/certificateConfirmation-interface';
import { CertificateConfirmationService } from 'src/app/certificateConfirmation/certificateConfirmation-service/certificateConfirmation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-answer-detail',
  templateUrl: 'detailEditGrade.component.html',
  styleUrls: ['detailEditGrade.component.css']
})
    export class DetailEditGradeComponent implements OnInit{

    grades: Grade[] = [];    
    studentFirstName: any;
    studentLastName: any;
    teacherFirstName: any;
    teacherLastName: any;
    studentId: any;
    courseId: any;
    type!: TypeOfTestingKnowledge;
    value!: string;
    description!: string;
    typeOfTestingKnowledge: TypeOfTestingKnowledge[] = [];
    allKnowledge: TypeOfTestingKnowledge[] = [];
    selectedKnowledge: number[] = [];
    certificateByUser: CertificateConfirmation[] = [];


    
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DetailEditGradeComponent>, private router: Router,
                        private route: ActivatedRoute, private aFileService: AFileService, private homeworkTestService: HomeworkTestService, private htFileService: HTFileService,
                        private loginService: LoginService, private gradeService: GradeService, private typeOfTestingKnowledgeService: TypeOfTestingKnowledgeService,
                        private certificateService: CertificateConfirmationService, private snackBar: MatSnackBar) {
        this.grades = data.grades;
        this.studentFirstName = data.studentFirstName;
        this.studentLastName = data.studentLastName;
        this.teacherFirstName = data.teacherFirstName;
        this.teacherLastName = data.teacherLastName;
        this.studentId = data.studentId;
        this.courseId = data.courseId;
        this.typeOfTestingKnowledge = data.allTypes;
        console.log('typ', this.typeOfTestingKnowledge);
}

ngOnInit(): void {
    console.log('Kliknięto przycisk Pobierz oceny.');
    this.gradeService.findAllByStudentAndClassGroup(this.studentId, this.courseId).subscribe((grades) => {
        console.log('Oceny dla studentId ' + this.studentId + ':', grades);
        this.gradesByUser[this.studentId] = grades as Grade[];
        
        console.log('load', this.gradesByUser[this.studentId]);
        
    });


    this.typeOfTestingKnowledgeService.getAll().subscribe((knowledge: TypeOfTestingKnowledge[]) => {
        this.allKnowledge = knowledge;
    });

    // this.certificateService.findCertificateConfirmationByUserIdAndClassGroupId(this.studentId, this.courseId).subscribe(
    //   (certificates: CertificateConfirmation | CertificateConfirmation[]) => {
    //     if (Array.isArray(certificates)) {
    //       this.certificateByUser = certificates.filter(certificate => 
    //         certificate.user.id === this.studentId && certificate.classGroup.id === this.courseId
    //       );
    
    //       console.log('Certificates for user:', this.certificateByUser);
    //     } else {
    //       console.error('Invalid response: Expected an array of certificates, but received:', certificates);
    //     }
    //   },
    //   (error) => {
    //     console.error('Error fetching certificates:', error);
    //   }
    // );
    

    this.certificateService.findCertificateConfirmationByUserIdAndClassGroupId(this.studentId, this.courseId).subscribe(
      (certificate: CertificateConfirmation | CertificateConfirmation[]) => {
        if (Array.isArray(certificate)) {
          this.certificateByUser = certificate;
        } else {
          this.certificateByUser = [certificate];
        }
        console.log('Certificate for user:', this.certificateByUser);
      },
      (error) => {
        console.error('Error fetching certificate:', error);
      }
    );
    
    
    
    
}

  saveChanges() {
    if (typeof this.certificateByUser[0].percentageScore === 'number' && this.certificateByUser[0].percentageScore >= 0 && this.certificateByUser[0].percentageScore <= 100) {
      this.certificateService.update(this.certificateByUser[0]).subscribe(
        response => {
          console.log('Zapisano zmiany');
          location.reload();
        },
        error => {
          console.error('Błąd podczas zapisywania zmian', error);
        }
      );
    } else {
      this.openSnackBar('Wynik musi być liczbą między 0 a 100', 'Error');
    }
  }


    gradesByUser: { [key: number]: Grade[] } = {};
    isEditing: boolean[] = [];


    toggleEditing(index: number) {
        this.isEditing[index] = !this.isEditing[index];
      }

      isCertificate(value: any): value is CertificateConfirmation {
        return value && value.gained !== undefined;
      }
      
   

    // saveEditing(index: number) {
    // const editedGrade = this.gradesByUser[this.studentId][index];
    // if(!editedGrade.finalValue) {
    //     if (this.selectedKnowledge[index] !== undefined) {
    //         editedGrade.typeOfTestingKnowledge = this.allKnowledge.find(type => type.id === this.selectedKnowledge[index]) as TypeOfTestingKnowledge;
    //     }
    //     this.gradeService.save(editedGrade).subscribe((response) => {
    //         this.isEditing[index] = false; // Wyłącz edycję po zapisie
    //         console.log('editedGrade.isFinalValue:', editedGrade.finalValue);
    //     });
    // }else if (editedGrade.finalValue == true) {
    //         this.gradeService.updateFinalGrade(editedGrade).subscribe((response) => {
    //             this.isEditing[index] = false; // Wyłącz edycję po zapisie
    //         });
    //     }
    

    // // location.reload();
    // }

    saveEditing(index: number): void {
      const editedGrade = this.gradesByUser[this.studentId][index];
  
      if (!editedGrade.finalValue) {
          if (this.selectedKnowledge[index] !== undefined) {
              editedGrade.typeOfTestingKnowledge = this.allKnowledge.find(type => type.id === this.selectedKnowledge[index]) as TypeOfTestingKnowledge;
          }
  
          // Dodaj warunek sprawdzający przed zapisem
          if (editedGrade.value > 0 && editedGrade.value < 7) {
              this.gradeService.save(editedGrade).subscribe((response) => {
                  this.isEditing[index] = false; // Wyłącz edycję po zapisie
                  console.log('editedGrade.isFinalValue:', editedGrade.finalValue);
                  location.reload();
              });
          } else {
              this.openSnackBar('Wartość musi być większa niż 1 i mniejsza niż 7', 'Error');
          }
      } else if (editedGrade.finalValue) {
          // Dodaj warunek sprawdzający przed zapisem dla finalValue
          if (editedGrade.value > 0 && editedGrade.value < 7) {
              this.gradeService.updateFinalGrade(editedGrade).subscribe((response) => {
                  this.isEditing[index] = false; // Wyłącz edycję po zapisie
                  location.reload();
              });
          } else {
              this.openSnackBar('Wartość musi być większa niż 1 i mniejsza niż 6', 'Error');
          }
      }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000, // Czas wyświetlania powiadomienia (w milisekundach)
    });
  }
  


    deleteGrade(index: number) {
        const gradeId = this.gradesByUser[this.studentId][index].id.toString(); // Konwersja na string
        
        this.gradeService.remove(gradeId).subscribe((response) => {
            // Obsługa odpowiedzi po usunięciu oceny
            this.gradesByUser[this.studentId].splice(index, 1); // Usuń ocenę z lokalnej tablicy
        });
        location.reload();
    }

    deleteCertificate() {
      if (this.certificateByUser && this.certificateByUser.length > 0) {
        const certificateId = this.certificateByUser[0].id; 
  
        this.certificateService.remove(certificateId).subscribe(
          response => {
            console.log('Certyfikat został usunięty.');
          },
          error => {
            console.error('Błąd podczas usuwania certyfikatu', error);
            location.reload();
          }
        );
      }
    }
      
}

