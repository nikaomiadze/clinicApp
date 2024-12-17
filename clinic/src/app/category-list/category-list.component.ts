import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { DoctorService } from '../doctor.service';
import { DoctorStateService } from '../doctor-state.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  constructor(public categories:CategoriesService,public doctors:DoctorService,public doctorState:DoctorStateService){}
  eachDoctor: any;
  @Output() showMoreChange = new EventEmitter<boolean>(); // Emit changes to show_more_btn

  ngOnInit(): void {
    this.requestCategories();
  }
  onShowMoreChange(value: boolean) {
    this.showMoreChange.emit(value); // Emit the updated value
    console.log('Show More Button State:', value);
  }
  requestCategories(){
    this.categories.get_category().subscribe({
      next: (res) => {
        this.categories.catlist = res;
        console.log('Categories fetched successfully:', res);
      },
      error: (err) => {
        console.error('Error in requestCategories():', err);
      }
    });
  }
  activeIndex: number | null = null; // Keeps track of the active category index
  get_doctor_by_cat(index: number) {
    this.activeIndex = index;
    console.log((this.categories.catlist[index].id)?.toString())
    const id = this.categories.catlist[index]?.id ?? 0;
    this.doctors.getDoctor_by_cat_id(id).subscribe({
      next:(res)=>{
        this.onShowMoreChange(res.length >= 6); // Update show_more_btn based on result length
        this.doctors.doctorlist=res;
        this.doctorState.setDoctorNotFound(false);
        console.log('Doctors fetched successfully:', res);
      },
      error: (err) => {
        console.error('Error in requestCategories():', err);
      }
    })
  }
  requestDoctors(){
    this.doctors.get_doctor().subscribe({
      next:(res)=>{
        this.doctors.doctorlist=res;
        this.doctorState.setDoctorNotFound(false);
        console.log('Doctors fetched successfully:', res);
        this.activeIndex=null;
      },
      error: (err) => {
        console.error('Error in requestCategories():', err);
      }
    });
  }
}

