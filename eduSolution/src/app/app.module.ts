import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainPageComponent } from './main-page/main-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpInterceptor } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';


import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SemesterListComponent } from './semester/semester-list/semester-list.component';
import { SemesterService } from './semester/semester-service/semester.service';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { NgClass } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';




import { CourseService } from './course/course-service/course.service';
import { CourseInlineEditingComponent } from './course/course-inline-editing/course-inline-editing.component';
import { ClassGroupService } from './classGroup/classGroup-service/classGroup.service';
import { ClassGroupInlineCrudComponent } from './classGroup/classGroup-inline-crud/classGroup-inline-crud.component';
import { LoginService } from './authorization_authentication/service/login.service';
import { LoginComponent } from './authorization_authentication/login/login.component';




@NgModule({
  exports: [
    MatGridListModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    MatTableModule,
    TableModule,
    SelectButtonModule,
    MatSelectModule
  ],
  declarations: [
    
  ],
  imports: [
    BrowserAnimationsModule
  ]
})
export class MaterialModule {}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MainPageComponent,
    SemesterListComponent,
    CourseInlineEditingComponent,
    ClassGroupInlineCrudComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    NgClass,
    RouterModule,
    ReactiveFormsModule,
    FormsModule

  ],
  providers: [SemesterService, CourseService, ClassGroupService, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
