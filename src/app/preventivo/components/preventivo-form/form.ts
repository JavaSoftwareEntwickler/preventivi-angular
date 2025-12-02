import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PreventivoFormAdapter } from './PreventivoFormAdapter';


@Component({
    selector: 'app-preventivo-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form.html',
    styleUrls: ['./form.css']
})
export class PreventivoForm implements OnChanges {
    @Input() preventivo: any | null = null;
    @Input() formPreventivo!: FormGroup; // <- passiamo il form dal padre
    @Input() isEditing = false;
    @Output() deleteRow = new EventEmitter<number>();
    constructor(public frmAdapter: PreventivoFormAdapter) { }


    ngOnChanges(ch: SimpleChanges) {
        if (ch['preventivo'] && this.preventivo) {
            //this.svc.formPreventivo.patchValue(this.preventivo);
            //this.svc.formPreventivo.disable();
            this.frmAdapter.patch(this.preventivo, this.formPreventivo);
            this.formPreventivo.disable();
        }
    }
}