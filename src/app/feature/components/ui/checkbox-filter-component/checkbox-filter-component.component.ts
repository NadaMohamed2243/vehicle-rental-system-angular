import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-checkbox-filter-component',
  imports: [FormsModule, CheckboxModule],
  templateUrl: './checkbox-filter-component.component.html',
  styleUrl: './checkbox-filter-component.component.css',
})
export class CheckboxFilterComponentComponent {
  @Input() items: string[] = [];
  @Input() selectedItems: string[] = [];

  @Output() selectedItemsChange = new EventEmitter<string[]>();

  onSelectedItemsChange() {
    this.selectedItemsChange.emit(this.selectedItems);
  }
}
