import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-radio-filter-component',
  imports: [RadioButtonModule, FormsModule],
  templateUrl: './radio-filter-component.component.html',
  styleUrl: './radio-filter-component.component.css',
})
export class RadioFilterComponentComponent {
  @Input() items: string[] = [];
  @Input() selectedItem: string | null = null;

  @Output() selectionChange = new EventEmitter<string | null>();

  onSelectedItemChange() {
    this.selectionChange.emit(this.selectedItem);
  }
}
