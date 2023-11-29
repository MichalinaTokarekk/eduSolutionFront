import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SemesterListComponent } from './semester/semester-list/semester-list.component';
import { CourseInlineEditingComponent } from './course/course-inline-editing/course-inline-editing.component';
import { ClassGroupInlineCrudComponent } from './classGroup/classGroup-inline-crud/classGroup-inline-crud.component';
import { LoginComponent } from './authorization_authentication/login/login.component';
import { AuthGuard } from './authorization_authentication/shared/auth.guard';
import { UserInlineCrudComponent } from './user/user-iline-crud/user-inline-crud.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { CourseGridViewComponent } from './course/course-grid-view/course-grid-view.component';
import { SectionManage } from './section/section-manage/section-manage.component';
import { EduMaterialManage } from './eduMaterial/eduMaterial-manage/eduMaterial-manage.component';
import { HomeworkTestManage } from './homeworkTest/homeworkTest-manage/homeworkTest-manage.component';
import { TeachingCoursesComponent } from './gradeBook/teachingCourses/teachingCourses.component';
import { ClassGroupsByCourseAndUser } from './gradeBook/classGroupsByCourseAndUser/classGroupsByCourseAndUser.component';
import { CoursesByStudentComponent } from './gradeBook/coursesByStudent/coursesByStudent.component';
import { UsersByYearBook } from './usersByYearBook/usersByYearBook.component';
import { YearBookUserDetailsComponent } from './yearBookUserDetails/yearBookUserDetails.component';
import { MyAllGradesComponent } from './myAllGrades/myAllGrades.component';
import { ArchivesHomeworkTestComponent } from './archivesHomeworkTest/archivesHomeworkTest.component';
import { LessonsScheduleComponent } from './schedule/lessonsSchedule/lessonsSchedule.component';
import { CalendarViewComponent } from './schedule/eventsSchedule/calendar-view.component';
import { RegisterEditComponent } from './authorization_authentication/register/register-edit/register-edit.component';
import { OfferPageComponent } from './offer/offerPage/offerPage.component';
import { ClassGroupsInCourseComponent } from './offer/classGroupsInCourse/classGroupsInCourse.component';
import { EventDetailPageComponent } from './schedule/eventsSchedule/eventDetailPage/eventDetailPage.component';

const routes: Routes = [
  {path: "dashboard", component: DashboardComponent, canActivate:[AuthGuard]},
  {path: "main-page", component: MainPageComponent},
  {path: "semester-list", component: SemesterListComponent},
  {path: "course-inline-editing", component: CourseInlineEditingComponent},
  {path: "classGroup-inline-crud", component: ClassGroupInlineCrudComponent},
  {path: "login", component: LoginComponent},
  {path: "user-inline-crud", component: UserInlineCrudComponent},
  {path: "admin-panel", component: AdminPanelComponent},
  {path: "course-grid-view", component: CourseGridViewComponent},
  {path: "section-manage", component: SectionManage},
  {path: "section-manage/:courseId", component: SectionManage},
  {path: "eduMaterial-manage/:id", component: EduMaterialManage},
  {path: "homeworkTest-manage/:id", component: HomeworkTestManage},
  {path: "teachingCourses-view", component: TeachingCoursesComponent},
  {path: "classGrioupsByCourseAndUser/:id", component: ClassGroupsByCourseAndUser},
  {path: "coursesByStudent-view", component: CoursesByStudentComponent},
  {path: "usersByYearBook", component: UsersByYearBook},
  {path: 'yearBookUserDetails/:id', component: YearBookUserDetailsComponent },
  {path: 'myAllGrades', component: MyAllGradesComponent },
  {path: 'archivesHomeworkTest/:id', component: ArchivesHomeworkTestComponent },
  {path: 'lessonSchedule', component: LessonsScheduleComponent },
  {path: 'calendar-view', component: CalendarViewComponent },
  {path: 'register-edit',component: RegisterEditComponent},
  {path: 'offerPage',component: OfferPageComponent},
  {path: 'classGroupsInCourse/:courseId',component: ClassGroupsInCourseComponent},
  {path: 'eventDetailPage/:eventId',component: EventDetailPageComponent},

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
