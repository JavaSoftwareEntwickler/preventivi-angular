import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PreventivoService } from '../../services/preventivo.service';


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
    constructor(public svc: PreventivoService) { }


    ngOnChanges(ch: SimpleChanges) {
        if (ch['preventivo'] && this.preventivo) {
            this.svc.formPreventivo.patchValue(this.preventivo);
            this.svc.formPreventivo.disable();
        }
    }
}