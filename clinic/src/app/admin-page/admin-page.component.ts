import { Component, OnInit } from '@angular/core';
import { DoctorStateService } from '../doctor-state.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit {
  doctor_not_found: boolean = false;
  doctors_clicked: boolean = true;
  category_cliked: boolean = false;
  register_cliked: boolean = false;
  show_more_btn: boolean = true;

  constructor(public doctorState: DoctorStateService) {}

  ngOnInit(): void {
    this.doctorState.doctorNotFound$.subscribe((status) => {
      this.doctor_not_found = status;
    });
  }

  // Handle navigation changes
  onNavChange(tab: string) {
    this.doctors_clicked = tab === 'doctors';
    this.category_cliked = tab === 'category';
    this.register_cliked = tab === 'register';
  }

  onShowMoreChange(value: boolean) {
    this.show_more_btn = value;
    console.log('Show More Button State in AdminPageComponent:', this.show_more_btn);
  }

}
