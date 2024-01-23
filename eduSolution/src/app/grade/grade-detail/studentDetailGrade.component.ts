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

@Component({
  selector: 'app-answer-detail',
  templateUrl: 'studentDetailGrade.component.html',
  styleUrls: ['studentDetailGrade.component.css'],
})
    export class StudentDetailGradeComponent implements OnInit{

    grades: Grade[] = [];    
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
    courseName!: string;
    certificateByUser: CertificateConfirmation[] = [];



    
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<StudentDetailGradeComponent>, private router: Router,
                        private route: ActivatedRoute, private aFileService: AFileService, private homeworkTestService: HomeworkTestService, private htFileService: HTFileService,
                        private loginService: LoginService, private gradeService: GradeService, private typeOfTestingKnowledgeService: TypeOfTestingKnowledgeService,
                        private certificateService: CertificateConfirmationService) {
        this.grades = data.grades;
        this.teacherFirstName = data.teacherFirstName;
        this.teacherLastName = data.teacherLastName;
        this.studentId = data.studentId;
        this.courseId = data.courseId;
        this.courseName = data.courseName; 
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


    gradesByUser: { [key: number]: Grade[] } = {};
    isEditing: boolean[] = [];


    toggleEditing(index: number) {
        this.isEditing[index] = !this.isEditing[index];
      }
   

    saveEditing(index: number) {
    const editedGrade = this.gradesByUser[this.studentId][index];
    if(!editedGrade.finalValue) {
        if (this.selectedKnowledge[index] !== undefined) {
            editedGrade.typeOfTestingKnowledge = this.allKnowledge.find(type => type.id === this.selectedKnowledge[index]) as TypeOfTestingKnowledge;
        }
        this.gradeService.save(editedGrade).subscribe((response) => {
            this.isEditing[index] = false; // Wyłącz edycję po zapisie
            console.log('editedGrade.isFinalValue:', editedGrade.finalValue);
        });
    }else if (editedGrade.finalValue == true) {
            this.gradeService.updateFinalGrade(editedGrade).subscribe((response) => {
                this.isEditing[index] = false; // Wyłącz edycję po zapisie
            });
        }
    

    // location.reload();
    }


    deleteGrade(index: number) {
        const gradeId = this.gradesByUser[this.studentId][index].id.toString(); // Konwersja na string
        
        this.gradeService.remove(gradeId).subscribe((response) => {
            // Obsługa odpowiedzi po usunięciu oceny
            this.gradesByUser[this.studentId].splice(index, 1); // Usuń ocenę z lokalnej tablicy
        });
        location.reload();
    }
      
}

