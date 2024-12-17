import { Component, OnInit } from '@angular/core';
import { DoctorStateService } from '../doctor-state.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit {
  doctor_not_found:boolean=false;
  doctors_clicked:boolean=true;
  category_cliked:boolean=false;
  register_cliked:boolean=false;
  constructor(public doctorState:DoctorStateService){}
  ngOnInit(): void {
    this.doctorState.doctorNotFound$.subscribe((status) => {
      this.doctor_not_found = status;
    });  
  }
  
  doctor_component(){
   this.doctors_clicked=true;
   this.category_cliked=false;
   this.register_cliked=false;
}
category_component(){
  this.category_cliked=true;
  this.doctors_clicked=false;
  this.register_cliked=false;
}
register_component(){
  this.register_cliked=true;
  this.doctors_clicked=false;
  this.category_cliked=false;
}

}
