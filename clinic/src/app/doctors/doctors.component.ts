import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { DoctorService } from '../doctor.service';
import { DoctorStateService } from '../doctor-state.service';
import { Router } from '@angular/router';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit {
  eachDoctor: any;
  constructor(public categories:CategoriesService,@Inject(PLATFORM_ID) private platformId: object,public doctors:DoctorService,private doctorState: DoctorStateService,private router: Router,private tokenService:TokenService){}
  doctorPicture:string='';
  doctor_not_found:boolean=false;
  fullDoctorList: any[] = []; 
  @Input() show_more_btn: boolean = true; // Receive value from AdminPageComponent
  roleId: string | null = null;
  ngOnChanges() {
    console.log('Show More Button State in DoctorsComponent:', this.show_more_btn);
  }  ngOnInit(): void {
        this.requestDoctors();
        this.doctorState.doctorNotFound$.subscribe((status) => {
          this.doctor_not_found = status;
        });
        this.tokenService.roleId$.subscribe(roleId => {
          this.roleId = roleId;
        });

  }  
  activeIndex: number | null = null; // Keeps track of the active category index

 requestDoctors() {
  this.doctors.get_doctor().subscribe({
    next: (res) => {
      this.show_more_btn=true;
      this.fullDoctorList = res;
      this.doctors.doctorlist = res.slice(0, 6);
      console.log('Doctors fetched successfully:', this.doctors.doctorlist);
      this.activeIndex = null;
    },
    error: (err) => {
      console.error('Error in requestDoctors():', err);
    }
  });
}
showMoreDoctors() {
  this.doctors.doctorlist = this.fullDoctorList; // Display the full list
  this.show_more_btn = false; // Hide the "Show More" button
}
  getImageSource(index: number): string {
    const doctor = this.doctors.doctorlist[index];
    return doctor.picture 
    ? `data:image/png;base64,${doctor.picture}` 
    : 'img/pngegg.png'; // Fallback if no picture is available
  }
  editDoctor(doctorId: number | undefined) {
    if (String(this.roleId) === '3') {  // Convert roleId to string
      this.router.navigate(['/edit-doctor', doctorId]);
    } else if (String(this.roleId) === '1') {  // Convert roleId to string
      this.router.navigate(['/booking-page', doctorId]);
    }
  }
}
