import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HomeworkTestService } from 'src/app/homeworkTest/homeworkTest-service/homeworkTest.service';
import { HTFileService } from 'src/app/htFile/htFile-service/htFile.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { User } from 'src/app/interfaces/user-interface';
import { Course } from 'src/app/interfaces/course-interface';
import { TypeOfTestingKnowledge } from 'src/app/interfaces/typeOfTestingKnowledge-interface';
import { TypeOfTestingKnowledgeService } from 'src/app/typeOfTestingKnowledge/typeOfTestingKnowledge-service/typeOfTestingKnowledge.service';
import { CertificateConfirmationService } from '../certificateConfirmation-service/certificateConfirmation.service';

@Component({
  selector: 'app-certificate-confirmation-detail',
  templateUrl: './addCertificateConfirmationDetail.component.html',
  styleUrls: ['./addCertificateConfirmationDetail.component.css']
})

    export class AddCertificateConfirmationDetailComponent implements OnInit{
        selectedStudent!: User;
        newGained!: number;
        newPercentageScore!:  boolean;
        allStudents: User[] = [];
        allKnowledge: TypeOfTestingKnowledge[] = [];
        studentFirstName: any;
        studentLastName: any;


    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddCertificateConfirmationDetailComponent>, private router: Router,
                        private route: ActivatedRoute, private homeworkTestService: HomeworkTestService, private htFileService: HTFileService,
                        private loginService: LoginService, private typeOfTestingKnowledgeService: TypeOfTestingKnowledgeService, private certificateConfirmationService: CertificateConfirmationService) {


        this.studentFirstName = data.studentFirstName;
        this.studentLastName = data.studentLastName;
        
    }
  
    ngOnInit(): void {
        this.typeOfTestingKnowledgeService.getAll().subscribe((knowledge: TypeOfTestingKnowledge[]) => {
            this.allKnowledge = knowledge;
        });
    }

    

    addNewCertificateConfirmation(): void {
        const newCertificateConfirmation= {
          gained: this.newGained,
          percentageScore: this.newPercentageScore,
          user: this.data.studentId,
          classGroup: this.data.courseId, 
        };
        console.log('student', this.data.studentId);
  
        // Wywołanie usługi do zapisu nowej oceny
        this.certificateConfirmationService.save(newCertificateConfirmation).subscribe((createdCertificateConfirmation) => {
          console.log('Nowa ocena została dodana:', createdCertificateConfirmation);
          this.dialogRef.close('saved');
        });
        location.reload();
    }
      

}

