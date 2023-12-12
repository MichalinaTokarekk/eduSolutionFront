import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainPageComponent } from './main-page/main-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpInterceptor } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';


import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SemesterListComponent } from './semester/semester-list/semester-list.component';
import { SemesterService } from './semester/semester-service/semester.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { NgClass } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';




import { CourseService } from './course/course-service/course.service';
import { CourseInlineEditingComponent } from './course/course-inline-editing/course-inline-editing.component';
import { ClassGroupService } from './classGroup/classGroup-service/classGroup.service';
import { ClassGroupInlineCrudComponent } from './classGroup/classGroup-inline-crud/classGroup-inline-crud.component';
import { LoginService } from './authorization_authentication/service/login.service';
import { LoginComponent } from './authorization_authentication/login/login.component';
import { UserService } from './user/user-service/user.service';
import { UserInlineCrudComponent } from './user/user-iline-crud/user-inline-crud.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ClassGroupGridViewComponent } from './course/classGroup-grid-view/classGroup-grid-view.component';
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
import { TypeOfTestingKnowledgeService } from './typeOfTestingKnowledge/typeOfTestingKnowledge-service/typeOfTestingKnowledge.service';
import { AddGradeDetailComponent } from './grade/grade-detail/add-Grade-detail.component';
import { DetailEditGradeComponent } from './grade/grade-detail/detailEditGrade.component';
import { TokenInterceptorService } from './authorization_authentication/service/token-interceptor.service';
import { AddFinalGradeDetailComponent } from './grade/grade-detail/addFinalGrade.component';
import { CoursesByStudentComponent } from './gradeBook/coursesByStudent/coursesByStudent.component';
import { StudentDetailGradeComponent } from './grade/grade-detail/studentDetailGrade.component';






import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { UsersByYearBook } from './usersByYearBook/usersByYearBook.component';
import { YearBookUserDetailsComponent } from './yearBookUserDetails/yearBookUserDetails.component';
import { GroupByPipe } from './yearBookUserDetails/groupByPipe.component';
import { MyAllGradesComponent } from './myAllGrades/myAllGrades.component';
import { ArchivesHomeworkTestComponent } from './archivesHomeworkTest/archivesHomeworkTest.component';
import { ArchivedAnswerDetailComponent } from './archivesHomeworkTest/archivedAnswerDetail.component';
import { LessonScheduleService } from './schedule/lessonsSchedule/lessonsSchedule-service/lessonsSchedule.service';
import { LessonsScheduleComponent } from './schedule/lessonsSchedule/lessonsSchedule.component';
import { LessonDialogComponent } from './schedule/lessonsSchedule/lessonDialog/lessonDialog.component';
import { LessonCreateDialogComponent } from './schedule/lessonsSchedule/lessonCreateDialog/lessonCreateDialog.component';
import { EventsScheduleService } from './schedule/eventsSchedule/eventsSchedule-service/eventsSchedule.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarViewComponent } from './schedule/eventsSchedule/calendar-view.component';
import { AddEventDialogComponent } from './schedule/eventsSchedule/addEventDialog/addEventDialog.component';
import { MatInputModule } from '@angular/material/input';
import { RegisterEditComponent } from './authorization_authentication/register/register-edit/register-edit.component';
import { RegisterService } from './authorization_authentication/register/register-service/register.service';
import { OfferPageComponent } from './offer/offerPage/offerPage.component';
import { ClassGroupsInCourseComponent } from './offer/classGroupsInCourse/classGroupsInCourse.component';
import { EventDetailPageComponent } from './schedule/eventsSchedule/eventDetailPage/eventDetailPage.component';
import { SearchPipe } from './classGroup/search.pipe';
import { CourseGridViewComponent } from './course/course-grid-view/course-grid-view.component';
import { MyProfileComponent } from './myProfile/myProfile.component';








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
    FormsModule,
    MatInputModule,
    MatCardModule

  ],
  declarations: [

  ],
  imports: [
    BrowserAnimationsModule,
    // FullCalendarModule 
    
  ]
})
export class MaterialModule { }

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
    ClassGroupGridViewComponent,
    SectionManage,
    EduMaterialManage,
    HomeworkTestManage,
    AnswerDetailComponent,
    TeachingCoursesComponent,
    ClassGroupsByCourseAndUser,
    AddGradeDetailComponent,
    DetailEditGradeComponent,
    AddFinalGradeDetailComponent,
    CoursesByStudentComponent,
    StudentDetailGradeComponent,
    UsersByYearBook,
    YearBookUserDetailsComponent,
    GroupByPipe,
    MyAllGradesComponent,
    ArchivesHomeworkTestComponent,
    ArchivedAnswerDetailComponent,
    LessonsScheduleComponent,
    LessonDialogComponent,
    LessonCreateDialogComponent,
    CalendarViewComponent,
    AddEventDialogComponent,
    RegisterEditComponent,
    OfferPageComponent,
    ClassGroupsInCourseComponent,
    EventDetailPageComponent,
    SearchPipe,
    CourseGridViewComponent,
    MyProfileComponent
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
    MatExpansionModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        }
      }
    }),
    FullCalendarModule

  ],
  providers: [SemesterService, CourseService, ClassGroupService, LoginService, JwtHelperService, UserService, SectionService, EduMaterialService, EMFileService,
    HomeworkTestService, HTFileService, AnswerService, AFileService, GradeService, TypeOfTestingKnowledgeService, LessonScheduleService, EventsScheduleService, RegisterService,
    {
      provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true
    }],
    
  bootstrap: [AppComponent]
})
export class AppModule { }
