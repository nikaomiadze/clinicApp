import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.css'
})
export class AdminNavComponent {
  @Output() navChange = new EventEmitter<string>();

  activeTab: string = 'doctors'; // Default active tab

  onNavClick(tab: string) {
    this.activeTab = tab; // Update the active tab
    this.navChange.emit(tab);
  }
}
