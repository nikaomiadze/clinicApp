import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../doctor.service';
import { DoctorStateService } from '../doctor-state.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  constructor(private doctor:DoctorService, private doctorState: DoctorStateService){}
  ngOnInit(): void {
  }
  searchQuery = {
    username: '',
    category_name: '',
  };
  search_doctor(){
    if(this.searchQuery.username!=""){
     this.get_user_by_username();
    }else if(this.searchQuery.category_name!=""){
      this.get_user_by_category_name();
    }
    this.searchQuery.username='';
    this.searchQuery.category_name='';
  }
  get_user_by_username(){
    this.doctor.getDoctor_by_username(this.searchQuery.username).subscribe({
      next:(res)=>{       
        console.log('Doctors search successfully:', res);
        this.doctor.doctorlist=res;
        if (!this.doctor.doctorlist || this.doctor.doctorlist.length === 0) {
          this.doctorState.setDoctorNotFound(true);
        } else {
          this.doctorState.setDoctorNotFound(false);
        }
      },
      error: (err) => {
        console.error('Error in get_user_by_username():', err);
      }
    });
  }
  get_user_by_category_name(){
    this.doctor.getDoctor_by_category_name(this.searchQuery.category_name).subscribe({
      next:(res)=>{       
        console.log('Doctors search successfully:', res);
        this.doctor.doctorlist=res;
        if (!this.doctor.doctorlist || this.doctor.doctorlist.length === 0) {
          this.doctorState.setDoctorNotFound(true);
        } else {
          this.doctorState.setDoctorNotFound(false);
        }
      },
      error: (err) => {
        console.error('Error in get_user_by_username():', err);
      }
    });
  }

}
