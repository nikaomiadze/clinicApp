import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { DoctorService } from '../doctor.service';
import { DoctorStateService } from '../doctor-state.service';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit {
  eachDoctor: any;
  constructor(public categories:CategoriesService,@Inject(PLATFORM_ID) private platformId: object,public doctors:DoctorService,private doctorState: DoctorStateService){}
  doctorPicture:string='';
  doctor_not_found:boolean=false;
  @Input() show_more_btn: boolean = true;
  ngOnInit(): void {
        this.requestDoctors();
        this.doctorState.doctorNotFound$.subscribe((status) => {
          this.doctor_not_found = status;
        });   
  }  
  activeIndex: number | null = null; // Keeps track of the active category index

 requestDoctors() {
  this.doctors.get_doctor().subscribe({
    next: (res) => {
      // Limit the doctor list to the first 6 items
      this.doctors.doctorlist = res.slice(0, 6);
      console.log('Doctors fetched successfully:', this.doctors.doctorlist);
      this.activeIndex = null;
    },
    error: (err) => {
      console.error('Error in requestDoctors():', err);
    }
  });
}
  getImageSource(index: number): string {
    const doctor = this.doctors.doctorlist[index];
    return doctor.picture 
    ? `data:image/png;base64,${doctor.picture}` 
    : 'img/pngegg.png'; // Fallback if no picture is available
  }
  

}
