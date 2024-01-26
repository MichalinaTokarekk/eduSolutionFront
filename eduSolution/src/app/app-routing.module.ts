import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SemesterListComponent } from './semester/semester-list/semester-list.component';
import { CourseInlineEditingComponent } from './course/course-inline-editing/course-inline-editing.component';
import { ClassGroupInlineCrudComponent } from './classGroup/classGroup-inline-crud/classGroup-inline-crud.component';
import { LoginComponent } from './authorization_authentication/login/login.component';
import { UserInlineCrudComponent } from './user/user-iline-crud/user-inline-crud.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { SectionManage } from './section/section-manage/section-manage.component';
import { EduMaterialManage } from './eduMaterial/eduMaterial-manage/eduMaterial-manage.component';
import { HomeworkTestManage } from './homeworkTest/homeworkTest-manage/homeworkTest-manage.component';
import { ClassGroupsByCourseAndUser } from './gradeBook/classGroupsByCourseAndUser/classGroupsByCourseAndUser.component';
import { ClassGroupsByStudentComponent } from './gradeBook/classGroupsByStudent/classGroupsByStudent.component';
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
import { ClassGroupGridViewComponent } from './course/classGroup-grid-view/classGroup-grid-view.component';
import { CourseGridViewComponent } from './course/course-grid-view/course-grid-view.component';
import { MyProfileComponent } from './myProfile/myProfile.component';
import { TeachingClassGroupsComponent } from './gradeBook/teachingClassGroups/teachingClassGroups.component';
import { TeachingCoursesComponent } from './gradeBook/teachingCourses/teachingCourses.component';
import { CoursesByStudentComponent } from './gradeBook/coursesByStudent/coursesByStudent.component';
import { MyCartComponent } from './offer/cart/myCart/myCart.component';
import { OfferDescriptionComponent } from './offer/offerDescription/offerDescription.component';
import { ParticipantsComponent } from './classGroup/participants/participants.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { AuthGuard } from './authorization_authentication/service/auth.guard';
import { TypeOfTestingKnowledgeComponent } from './typeOfTestingKnowledge/typeOfTestingKnowledge-component/typeOfTestingKnowledge.component';
import { ClassGroupNewPageComponent } from './classGroup/classGroup-newPage/classGroup-newPage.component';

const routes: Routes = [
  {path: "dashboard", component: DashboardComponent, canActivate:[AuthGuard], data: { roles: ['admin', 'user', 'teacher'] }},
  {path: "main-page", component: MainPageComponent},
  {path: "semester-list", component: SemesterListComponent, canActivate:[AuthGuard], data: { roles: ['admin'] }},
  {path: "course-inline-editing", component: CourseInlineEditingComponent, canActivate:[AuthGuard], data: { roles: ['admin'] }},
  {path: "classGroup-inline-crud", component: ClassGroupInlineCrudComponent, canActivate:[AuthGuard], data: { roles: ['admin', 'teacher'] }},
  {path: "login", component: LoginComponent},
  {path: "user-inline-crud", component: UserInlineCrudComponent, canActivate:[AuthGuard], data: { roles: ['admin'] }},
  {path: "admin-panel", component: AdminPanelComponent, canActivate:[AuthGuard], data: { roles: ['admin'] }},
  {path: "classGroup-grid-view/:courseId", component: ClassGroupGridViewComponent},
  {path: "section-manage", component: SectionManage},
  {path: "section-manage/:courseId", component: SectionManage},
  {path: "eduMaterial-manage/:id/:sectionId", component: EduMaterialManage},
  {path: "homeworkTest-manage/:id", component: HomeworkTestManage},
  {path: "teachingClassGroups-view/:courseId", component: TeachingClassGroupsComponent},
  {path: "classGroupsByCourseAndUser/:id", component: ClassGroupsByCourseAndUser},
  {path: "classGroupsByStudent-view/:courseId", component: ClassGroupsByStudentComponent},
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
  {path: 'course-grid-view',component: CourseGridViewComponent},
  {path: 'myProfile',component: MyProfileComponent},
  {path: 'teachingCourses',component: TeachingCoursesComponent},
  {path: 'coursesByStudent-view',component: CoursesByStudentComponent},
  // {path: 'myCart',component: MyCartComponent},
  { path: 'offer-description/:classGroupId', component: OfferDescriptionComponent },
  { path: 'participants/:classGroupId', component: ParticipantsComponent },
  { path: 'user-details/:userId', component: UserDetailsComponent },
  { path: 'typeOfTestingKnowledge-inline', component: TypeOfTestingKnowledgeComponent },
  { path: 'classGroupNewPage', component: ClassGroupNewPageComponent },

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
