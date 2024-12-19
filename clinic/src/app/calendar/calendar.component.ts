import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  ngOnInit(): void {
  this.updateCalendar();
  this.generateCurrentWeek();
  }
  weekdays: string[] = ['(ორშ)', '(სამ)', '(ოთხ)', '(ხუთ)', '(პარ)', '(შაბ)', '(კვი)'];
  currentMonth='';
  currentYear=0;
  hours: string[]=['9:00-10:00','10:00-11:00','11:00-12:00','12:00-13:00','13:00-14:00','14:00-15:00','15:00-16:00','16:00-17:00'];
  readonly Months = [
    'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 
    'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო',
    'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'
  ];
  currentWeek: { day: string; date: number }[] = [];
  now:Date =new Date();
  currentWeekStart = new Date(this.now.setDate(this.now.getDate()));

  //for modal
   
  reservationDescription: string = '';
  showModal: boolean = false;
  modalPosition = { top: 0, left: 0 };
  selectedDay: { day: string; date: number } | null = null;
  selectedHour: string = '';
  
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
          date: currentDate.getDate()
        };
      });
  }
  logDate(day: { day: string; date: number }, time: string): void {
    const now = new Date(this.currentWeekStart);
    now.setDate(this.currentWeekStart.getDate() + this.currentWeek.findIndex(d => d.date === day.date));
  
    // Format the full date-time string
    const dateTime = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${time}`;
    
    console.log('Full Date-Time:', dateTime);
  
    // Optionally send the date and time to the API
    this.sendDateTimeToApi(day, now.getMonth() + 1, now.getFullYear(), time);

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
    // Get button position
    const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
    
    this.modalPosition.top = buttonRect.top + window.scrollY + 50; // 40px offset for better visibility
    this.modalPosition.left = buttonRect.left + window.scrollX + 50;
    
    this.selectedDay = day;
    this.selectedHour = hour;
    this.showModal = true;
  }
  submitReservation() {
    const reservationData = {
      date: `${this.selectedDay?.date}-${this.currentMonth}-${this.currentYear}`,
      time: this.selectedHour,
      description: this.reservationDescription
    }
    console.log('Sending reservation data:', reservationData);
    this.sendReservationToApi(reservationData);
    this.showModal = false; // Close the modal after submitting
    this.reservationDescription = '';

    
  }
  sendReservationToApi(data: any) {
    // Send data to the API
    // Example of sending data:
    // this.http.post('/api/reservations', data).subscribe(response => {
    //   console.log('Reservation saved:', response);
    // });
  }
}




