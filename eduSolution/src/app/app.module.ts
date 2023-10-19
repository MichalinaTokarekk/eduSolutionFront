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
import { UserService } from './user/user-service/user.service';
import { UserInlineCrudComponent } from './user/user-iline-crud/user-inline-crud.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { CourseGridViewComponent } from './course/course-grid-view/course-grid-view.component';
import { SectionManage } from './section/section-manage/section-manage.component';
import { SectionService } from './section/section-service/section.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { EduMaterialService } from './eduMaterial/eduMaterial-service/eduMaterial.service';
import { EduMaterialManage } from './eduMaterial/eduMaterial-manage/eduMaterial-manage.component';
import { EMFileService } from './emFile/emFile-service/emFile.service';
import { HomeworkTestService } from './homeworkTest/homeworkTest-service/homeworkTest.service';
import { HomeworkTestManage } from './homeworkTest/homeworkTest-manage/homeworkTest-manage.component';
import { HTFileService } from './htFile/htFile-service/htFile.service';
import { AnswerService } from './answer/answer-service/answer.service';
import { AFileService } from './aFile/aFile-service/aFile.service';
import { AnswerDetailComponent } from './answer/answer-detail/answer-detail.component';
import { TeachingCoursesComponent } from './gradeBook/teachingCourses/teachingCourses.component';
import { ClassGroupsByCourseAndUser } from './gradeBook/classGroupsByCourseAndUser/classGroupsByCourseAndUser.component';
import { GradeService } from './grade/grade-service/grade.service';




@NgModule({
  exports: [
    MatGridListModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    MatTableModule,
    TableModule,
    SelectButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    RouterModule,
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
    LoginComponent,
    UserInlineCrudComponent,
    AdminPanelComponent,
    CourseGridViewComponent,
    SectionManage,
    EduMaterialManage,
    HomeworkTestManage,
    AnswerDetailComponent,
    TeachingCoursesComponent,
    ClassGroupsByCourseAndUser
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
    FormsModule,
    MatExpansionModule
    
  ],
  providers: [SemesterService, CourseService, ClassGroupService, LoginService, UserService, SectionService, EduMaterialService, EMFileService, 
    HomeworkTestService, HTFileService, AnswerService, AFileService, GradeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
