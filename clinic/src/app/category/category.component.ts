import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  constructor(public doctors:DoctorService){}

  ngOnInit(): void {
    this.requestDoctors();
  }

  requestDoctors(){
    this.doctors.get_doctor().subscribe({
      next:(res)=>{
        this.doctors.doctorlist=res;
        console.log('Doctors fetched successfully:', res);
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
  delete_doctor(doctor_id: any){
    this.doctors.deleteDoctor_by_id(doctor_id).subscribe({
      next:(res)=>{
        console.log(res);
        this.requestDoctors();
      },
      error:(err)=>{
        console.error('error during a doctor deleting');
      }
    })
  }
}
