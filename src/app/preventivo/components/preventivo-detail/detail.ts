import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreventivoForm } from '../preventivo-form/form';
import { PreventivoActions } from '../preventivo-actions/actions';
import { PreventiviService } from '../../services/preventivi.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PreventivoFormAdapter } from '../preventivo-form/PreventivoFormAdapter';


@Component({
    selector: 'app-preventivo-detail',
    standalone: true,
    imports: [CommonModule, PreventivoForm, PreventivoActions, ReactiveFormsModule],
    templateUrl: './detail.html',
    styleUrls: ['./detail.css']
})
export class PreventivoDetail {
    @Input() preventivo: any | null = null;
    @Input() formPreventivo!: FormGroup; // <- passiamo il form dal padre
    @Output() back = new EventEmitter<void>();

    constructor(public svc: PreventiviService, public formAdapter: PreventivoFormAdapter) { }

    startEdit() { this.svc.editPreventivo(); }
    save() { this.svc.savePreventivo(); this.back.emit(); }
    cancel() { this.svc.cancelEdit(); this.back.emit(); }
    doPrint() { if (this.preventivo) this.svc.printPreventivo(this.preventivo); }
    doDelete() { if (this.preventivo) this.svc.deletePreventivo(this.preventivo); this.back.emit(); }
    doAddRow() { if (this.preventivo) { this.formAdapter.addRiga(this.svc.formPreventivo); } }
    doDeleteRow(index: number) { if (this.preventivo) { this.formAdapter.removeRiga(this.svc.formPreventivo, index); } }
}