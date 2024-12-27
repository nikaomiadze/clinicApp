import { Component } from '@angular/core';
@Component({
  selector: 'app-doctor-edit',
  templateUrl: './doctor-edit-page.component.html',
  styleUrls: ['./doctor-edit-page.component.css'] 
})

export class DoctorEditpageComponent {
  deletebtn_for_admin: boolean = false;  // Variable to control delete button state

  // Method to handle delete button click from child (doctor-info)
  handleDeleteButtonClick() {
    this.deletebtn_for_admin = !this.deletebtn_for_admin;
    }  
}
