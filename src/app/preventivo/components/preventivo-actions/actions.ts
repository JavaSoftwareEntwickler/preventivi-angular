import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
    selector: 'app-preventivo-actions',
    standalone: true,
    templateUrl: './actions.html',
    styleUrls: ['./actions.css']
})
export class PreventivoActions {
    @Input() isEditing = false;
    @Output() edit = new EventEmitter<void>();
    @Output() save = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();
    @Output() print = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();
    @Output() addRow = new EventEmitter<void>();
}