import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TokenService } from '../token.service';
import { BookingService } from '../booking.service';
import { ActivatedRoute } from '@angular/router';
import { booking } from '../models/booking';
import { UserService } from '../user.service';
import { userInfo } from 'os';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
  constructor(private tokenService:TokenService,private bookingService:BookingService,private route:ActivatedRoute,private userService:UserService){}
  ngOnInit(): void {
    this.updateCalendar();
    this.generateCurrentWeek();
    this.tokenService.roleId$.subscribe(roleId => {
      this.roleId = roleId ? roleId.toString() : null;
    })
    this.route.params.subscribe(params => {
      this.doctorId = parseInt(params['id']); 
      this.fetchDoctorBookings(this.doctorId);
    });
  
    // Initialize userId by subscribing to currentUserData
    this.userService.currentUserData.subscribe(userData => {
      this.userId = userData?.id;
      console.log("User ID:", this.userId); // Log to verify if it's correctly assigned
    });
  }
  doctorId: number | undefined;
  userId: number | undefined;
  weekdays: string[] = ['(ორშ)', '(სამ)', '(ოთხ)', '(ხუთ)', '(პარ)', '(შაბ)', '(კვი)'];
  currentMonth='';
  currentYear=0;
  hours: string[]=['9:00-10:00','10:00-11:00','11:00-12:00','12:00-13:00','13:00-14:00','14:00-15:00','15:00-16:00','16:00-17:00'];
  readonly Months = [
    'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 
    'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო',
    'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'
  ];
  reservations: {
    userId: number; date: Date; hour: string;
    reservationId: number; 
  }[] = []; 
  currentWeek: { day: string; date: number }[] = [];
  now:Date =new Date();
  roleId: string | null = null;
  currentWeekStart = new Date(this.now.setDate(this.now.getDate()));

  //for modal
   
  reservationDescription: string = '';
  showModal: boolean = false;
  modalPosition = { top: 0, left: 0 };
  selectedDay: { day: string; date: number } | null = null;
  selectedHour: string = '';

  @Input() deletebtn_for_admin: boolean = false;

updateCalendar() {
  const monthIndex = this.currentWeekStart.getMonth(); // Get month as 0-11
  this.currentMonth = this.Months[monthIndex];
  this.currentYear = this.currentWeekStart.getFullYear();
}
generateCurrentWeek() {
  const startDate = new Date(this.currentWeekStart);
  this.currentWeek = Array(7)
    .fill(null)
    .map((_, index) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + index);
      return {
        day: this.weekdays[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1], // Map day index (Sunday=0) to Georgian weekdays
        date: currentDate.getDate(),
      };
    });

  // Deduplication logic
  this.currentWeek = this.currentWeek.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.day === value.day && t.date === value.date)
  );
  console.log('Filtered currentWeek:', this.currentWeek);

}
  isPastDate(day: { day: string; date: number }): boolean {
    const today = new Date();
    const calendarDate = new Date(this.currentWeekStart);
    calendarDate.setDate(this.currentWeekStart.getDate() + this.currentWeek.findIndex(d => d.date === day.date));
  
    // Compare calendar date with today
    return calendarDate < new Date(today.setHours(0, 0, 0, 0)); // Ignore time component
  }
  nextWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7); // Move start date forward by 7 days
    this.currentWeek = Array(7)
      .fill(null)
      .map((_, index) => {
        const currentDate = new Date(this.currentWeekStart);
        currentDate.setDate(this.currentWeekStart.getDate() + index);
        return {
          day: this.weekdays[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1], // Map day index to Georgian weekdays
          date: currentDate.getDate(),
        };
      });
      this.updateCalendar();
  }
  isWeekend(day: { day: string; date: number }): boolean {
    const date = new Date(this.currentWeekStart);
    date.setDate(this.currentWeekStart.getDate() + this.currentWeek.findIndex(d => d.date === day.date));
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    return dayOfWeek === 0 || dayOfWeek === 6;
  }
  previousWeek(){
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7); // Move start date forward by 7 days
    this.currentWeek = Array(7)
      .fill(null)
      .map((_, index) => {
        const currentDate = new Date(this.currentWeekStart);
        currentDate.setDate(this.currentWeekStart.getDate() + index);
        return {
          day: this.weekdays[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1], // Map day index to Georgian weekdays
          date: currentDate.getDate(),
        };
      });
      this.updateCalendar();
  }
  nextMonth() {
    // Move to the next month while keeping the day of the month consistent
    const currentDay = this.currentWeekStart.getDate();
    this.currentWeekStart.setMonth(this.currentWeekStart.getMonth() + 1);
    
    // Handle cases where the day exceeds the number of days in the new month
    const maxDaysInMonth = new Date(
      this.currentWeekStart.getFullYear(),
      this.currentWeekStart.getMonth() + 1,
      0
    ).getDate();
    this.currentWeekStart.setDate(Math.min(currentDay, maxDaysInMonth));
  
    this.generateCurrentWeek();
    this.updateCalendar();
  }
  
  prevMonth() {
    // Move to the previous month while keeping the day of the month consistent
    const currentDay = this.currentWeekStart.getDate();
    this.currentWeekStart.setMonth(this.currentWeekStart.getMonth() - 1);
    
    // Handle cases where the day exceeds the number of days in the new month
    const maxDaysInMonth = new Date(
      this.currentWeekStart.getFullYear(),
      this.currentWeekStart.getMonth() + 1,
      0
    ).getDate();
    this.currentWeekStart.setDate(Math.min(currentDay, maxDaysInMonth));
  
    this.generateCurrentWeek();
    this.updateCalendar();
  }
  sendDateTimeToApi(day: { date: number }, month: number, year: number, time: string): void {
    const timeParts = time.split('-');
    const startHour = parseInt(timeParts[0], 10);
    const date = new Date(year, month - 1, day.date, startHour); // Construct the date
    console.log('Sending date and time to API:', date);
  }
  openModal(event: MouseEvent, day: { day: string; date: number }, hour: string) {
    const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
    const modalWidth = 420; // Modal width
    const modalHeight = 263; // Modal height
    const viewportWidth = window.innerWidth;
  
    // Default position to the right and below the button
    let top = buttonRect.top + window.scrollY + 50; // Offset for better visibility
    let left = buttonRect.left + window.scrollX + 50;
  
    // Check if modal exceeds the right edge of the viewport
    if (left + modalWidth > viewportWidth) {
      left = buttonRect.left + window.scrollX - modalWidth - 10; // Adjust to the left of the button with 10px padding
    }
  
    // Set the modal position
    this.modalPosition = { top, left };
    this.selectedDay = day;
    this.selectedHour = hour;
    this.showModal = true;
  }
  submitReservation() {
    if (!this.selectedDay || !this.selectedHour) {
      console.error('Day or hour not selected');
      return;
    }
  
    // Get the month index from the Months array
    const monthIndex = this.Months.indexOf(this.currentMonth); // Get index of the current month (0-11)
    if (monthIndex === -1) {
      console.error('Invalid month:', this.currentMonth);
      return;
    }
  
    // Construct the full date and time
    const selectedDate = new Date(
      this.currentYear,
      monthIndex,
      this.selectedDay.date
    );
  
    // Parse the hour and minute from the selectedHour
    const [hour, minute] = this.selectedHour.split(':').map(Number);
    selectedDate.setHours(hour+4, minute || 0); // Default to 0 if minute is undefined
  
    // Convert to ISO 8601 format
    const bookingDate = selectedDate.toISOString();
    this.userService.currentUserData.subscribe((userdata)=>{
      this.userId=userdata?.id;
    })
    const reservationData = new booking(
      this.userId,
      this.doctorId,
      selectedDate,
      this.reservationDescription
    );
  
    console.log('Sending reservation data:', reservationData);
  
    // Send the reservation data to the API
    this.sendReservationToApi(reservationData);
  
    // Close modal and reset description
    this.showModal = false;
    this.reservationDescription = '';
  }
  
  sendReservationToApi(booking:booking) {
    this.bookingService.Add_booking(booking).subscribe((res)=>{
      if(res){
        console.log(res);
        if (this.doctorId !== undefined) {
          this.fetchDoctorBookings(this.doctorId); // Refresh reservations after adding the booking
        } else {
          console.error('doctorId is undefined, cannot fetch bookings');
        }
      }
    });
  }
  fetchDoctorBookings(doctorId: number): void {
    this.bookingService.Get_doctor_booking(doctorId).subscribe(
      (data) => {
        this.reservations = data.map((res: any) => {
          const bookingDate = new Date(res.booking_date);
          console.log('Reservations for doctor:', res.id);
          return {
            date: bookingDate,
            hour: `${bookingDate.getHours()}:00-${bookingDate.getHours() + 1}:00`,
            userId: res.userId,
            reservaionId: res.id
              // Assuming userId is part of the response
          };
        });
        
        console.log('Reservations for doctor:', this.reservations);
      },
      (error) => {
        console.error('Error fetching doctor bookings:', error);
      }
    );
  }
  

  // Check if a button is reserved
  isButtonReserved(date: number, hour: string): { userId: number; reservationId: number } | null {
    if (!this.reservations || this.reservations.length === 0) {
      return null; // No reservations available
    }
  
    // Derive the month index from the currentMonth
    const monthIndex = this.Months.indexOf(this.currentMonth);
    if (monthIndex === -1) {
      console.error('Invalid month:', this.currentMonth);
      return null; // Invalid month index
    }
  
    // Construct the full date using the current year and month
    const selectedDate = new Date(this.currentYear, monthIndex, date + 1);
    const dateStr = selectedDate.toISOString().split('T')[0];
  
    // Find the reservation that matches the date, hour, and userId
    const reservation = this.reservations.find(
      (reservation) =>
        reservation.date.toISOString().split('T')[0] === dateStr &&
        reservation.hour === hour
    );
  
    return reservation || null;
  }
  
  isUserBooking(date: number, hour: string): { userId: number; reservationId: number } | null {
    const selectedDate = new Date(this.currentYear, this.Months.indexOf(this.currentMonth), date + 1);
    const dateStr = selectedDate.toISOString().split('T')[0];
  
  
    const reservation = this.reservations.find(
      (reservation) =>
        reservation.date.toISOString().split('T')[0] === dateStr &&
        reservation.hour === hour &&
        reservation.userId === this.userId
    );  
    return reservation || null;
  }
  logAndDelete(date: number, hour: string): void {
    let matchedBooking;

    if(this.roleId==='1'){
    matchedBooking = this.isUserBooking(date, hour);
    }else if(this.roleId==='2'||this.roleId==='3'){
    matchedBooking=this.isButtonReserved(date,hour);
    }
    
    console.log('Matched booking:', matchedBooking);
  
    if (matchedBooking) {
      // Dynamically access the property to handle the typo
      const reservationId = (matchedBooking as any).reservationId ?? (matchedBooking as any).reservaionId;
      if (reservationId) {
        this.deleteReservation(reservationId);
      } else {
        console.error('No valid reservationId or reservaionId found in matchedBooking:', matchedBooking);
      }
    } else {
      console.log('No matching reservation to delete.');
    }
  }
  
  
  
  deleteReservation(reservationId: number | undefined): void {
    if (reservationId !== undefined) {
      this.bookingService.Delete_booking(reservationId).subscribe(
        (response) => {
          console.log('Reservation deleted successfully:', response);
          // Refresh reservations
          if (this.doctorId !== undefined) {
            this.fetchDoctorBookings(this.doctorId);
          }
        },
        (error) => {
          console.error('Error deleting reservation:', error);
        }
      );
    } else {
      console.log('No reservation to delete');
    }
  }
  
}
