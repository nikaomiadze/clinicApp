import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-doctor-edit-container',
  templateUrl: './doctor-edit-container.component.html',
  styleUrl: './doctor-edit-container.component.css'
})
export class DoctorEditContainerComponent implements OnInit {
  doctorId!: string;
  doctorInfo: any = {};
  constructor(private route:ActivatedRoute,private doctorService:DoctorService){}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.doctorId = params['id']; 
      this.loadDoctorData(this.doctorId);
    });
  }
  loadDoctorData(id: string) {
    this.doctorService.getDoctorById(this.doctorId).subscribe((doctorInfo)=>{
      this.doctorInfo = doctorInfo; 
      console.log(doctorInfo);
  })
    console.log(`Load data for doctor with ID: ${id}`);
  }
  getImageSource(): string {
    return this.doctorInfo?.picture
      ? `data:image/png;base64,${this.doctorInfo.picture}`
      : 'img/pngegg.png';
  }

}
