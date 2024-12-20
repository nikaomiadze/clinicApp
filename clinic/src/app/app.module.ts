import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http'; // Import this


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { DoctorRegisterComponent } from './doctor-register/doctor-register.component';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { CategoryComponent } from './category/category.component';
import { authInterceptor } from './interceptors/auth.interceptor';
import { DoctorEditpageComponent } from './doctor-edit-page/doctor-edit-page.component';
import { AdminNavComponent } from './admin-nav/admin-nav.component';
import { DoctorEditContainerComponent } from './doctor-edit-container/doctor-edit-container.component';
import { CalendarComponent } from './calendar/calendar.component';
import { BookingPageComponent } from './booking-page/booking-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchComponent,
    UserRegisterComponent,
    DoctorRegisterComponent,
    LoginComponent,
    MainPageComponent,
    CategoryListComponent,
    DoctorProfileComponent,
    UserProfileComponent,
    AdminPageComponent,
    DoctorsComponent,
    CategoryComponent,
    DoctorEditpageComponent,
    AdminNavComponent,
    DoctorEditContainerComponent,
    CalendarComponent,
    BookingPageComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule
    
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: authInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
