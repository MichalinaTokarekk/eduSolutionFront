import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfirmationDialogSemesterComponent } from '../../confirmations/semester/confirmation-dialog-semester.component';
import { Subscription, catchError, of, switchMap, tap } from 'rxjs';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';


/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'expansion-overview-example',
  templateUrl: 'classGroupsByCourseAndUser.component.html',
  styleUrls: ['classGroupsByCourseAndUser.component.css'],
})
export class ClassGroupsByCourseAndUser implements OnInit {
classGroup: any = {};
classGroups!: any[]; 

constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar, 
            private classGroupService: ClassGroupService, private loginService: LoginService){}


ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id !== null) {
        this.classGroupService.get(id).subscribe((classGroup: any) => {
          this.classGroup = classGroup;

          const token = this.loginService.getToken();
          const _token = token.split('.')[1];
          const _atobData = atob(_token);
          const _finalData = JSON.parse(_atobData);
          this.classGroupService.findClassGroupsByCourseAndUserId(classGroup.id, _finalData.id).subscribe((classGroups: any) => {
            this.classGroups = classGroups;
          }, error => {
            console.error(error);
          });
          
        }, error => {
          console.error(error);
        });
      } else {
        console.log("Nie ma nic");
      }
    });
  }
  




}
