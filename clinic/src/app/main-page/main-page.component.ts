import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { DoctorService } from '../doctor.service';
import { DoctorStateService } from '../doctor-state.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit {
eachDoctor: any;
  constructor(public categories:CategoriesService,@Inject(PLATFORM_ID) private platformId: object,public doctors:DoctorService,private doctorState: DoctorStateService){}
  doctorPicture:string='';
  doctor_not_found:boolean=false;
  show_more_btn:boolean=true;

  ngOnInit(): void {
        this.requestDoctors();
        this.doctorState.doctorNotFound$.subscribe((status) => {
          this.doctor_not_found = status;
        });   
  }  
 
  activeIndex: number | null = null; // Keeps track of the active category index

  requestDoctors(){
    this.doctors.get_doctor().subscribe({
      next:(res)=>{
        this.show_more_btn=true;
        this.doctors.doctorlist=res;
        console.log('Doctors fetched successfully:', res);
        this.activeIndex=null;
      },
      error: (err) => {
        console.error('Error in requestCategories():', err);
      }
    });
  }
  getImageSource(index: number): string {
    const doctor = this.doctors.doctorlist[index];
    return doctor.picture 
    ? `data:image/png;base64,${doctor.picture}` 
    : 'img/pngegg.png'; // Fallback if no picture is available
  }
  
onShowMoreChange(value: boolean) {
  this.show_more_btn = value; // Update the value of show_more_btn
  console.log('Show More Button State in AdminPageComponent:', this.show_more_btn);
}
  

}
