import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegisterComponent } from './user-register/user-register.component';
import { DoctorRegisterComponent } from './doctor-register/doctor-register.component';
import { MainPageComponent } from './main-page/main-page.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { RoleGuard } from './role.guard';
import { DoctorEditpageComponent } from './doctor-edit-page/doctor-edit-page.component';

const routes: Routes = [
  {path:"user-register",component:UserRegisterComponent},
  {path:"",component:MainPageComponent},
  {path:"admin-page",component:AdminPageComponent,canActivate:[RoleGuard]},
  {path: 'edit-doctor/:id', component: DoctorEditpageComponent,canActivate:[RoleGuard] },
  {path:"user-page",component:UserProfileComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
