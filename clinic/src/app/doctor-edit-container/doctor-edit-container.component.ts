import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../doctor.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-doctor-edit-container',
  templateUrl: './doctor-edit-container.component.html',
  styleUrl: './doctor-edit-container.component.css'
})
export class DoctorEditContainerComponent implements OnInit {
  doctorId!: string;
  doctorInfo: any = {
    person_id: '' ,
    email: ''
  };
  selectedPicture: File | null = null;
  profilePhotoUrl: string = ''; // Store the photo URL
  isEditing: boolean = false;
  email_editing:boolean=false;
  person_id_editing:boolean=false;
  newPassword: string = '';
  newEmail:string='';
  newPerson_id:string='';
  @Output() deleteButtonClicked = new EventEmitter<void>();  

  onDeleteButtonClick() {
    this.deleteButtonClicked.emit();
  }
  constructor(private route:ActivatedRoute,private doctorService:DoctorService,private adminService:AdminService){}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.doctorId = params['id']; 
      this.loadDoctorData(this.doctorId);
    });
  }
  onPictureSelected(event: any) {
    this.selectedPicture = event.target.files[0];
    this.Update_Doctor();
  }
  toggleEditMode() {
    this.isEditing = !this.isEditing;
  }
  toggleemaileditMode(){
    this.email_editing=!this.email_editing;
    this.newEmail=this.doctorInfo.email;
  }
  togglepersonIdeditMode(){
    this.person_id_editing=!this.person_id_editing;
    this.newPerson_id = this.doctorInfo.person_id;
  }
  triggerFileInput(): void {
    const fileInput = document.querySelector('.file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
  
  Update_Doctor():void{
    const formData: FormData = new FormData();
    formData.append('email', this.newEmail || '');
    formData.append('person_id',this.newPerson_id || '');
    formData.append('password',this.newPassword || '');
    if (this.selectedPicture) {
      formData.append('profile_img', this.selectedPicture, this.selectedPicture.name);
    }
    this.adminService.Update_doctor(this.doctorId,formData).subscribe(
      response => {
      console.log('Doctor updated successfully:', response);
      this.loadDoctorData(this.doctorId);
    },
    error => {
      console.error('Error updating doctor:', error);
    })
    this.isEditing = false;
    this.person_id_editing=false;
    this.email_editing=false;
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
