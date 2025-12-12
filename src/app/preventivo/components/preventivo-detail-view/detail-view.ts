import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreventivoFormEditComponent } from '../preventivo-form-edit/form-edit';
import { PreventivoManagementService } from '../../services/preventivo-managment.service';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PreventivoFormService } from '../../services/form.service';
import { RighePreventivoModel } from '../../models/righe-preventivo-model';
import { DynamicPaginationService } from '../../../shared/services/dynamic-pagination.service';


@Component({
    selector: 'app-preventivo-detail-view',
    standalone: true,
    imports: [CommonModule, PreventivoFormEditComponent, ReactiveFormsModule],
    templateUrl: './detail-view.html',
    styleUrls: ['./detail-view.css']
})
export class PreventivoDetailViewComponent {
    @Input() preventivo: any | null = null;
    @Input() formPreventivo!: FormGroup; // <- passiamo il form dal padre
    @Output() back = new EventEmitter<void>();
    righeSignal = signal<RighePreventivoModel[]>([]);
    titolo: string = '';

    constructor(
        public formHelper: PreventivoFormService,
        public dataPagService: DynamicPaginationService<RighePreventivoModel>,
        public service: PreventivoManagementService) {
    }
    ngOnInit(): void {
        if (this.service.isCreating()) {
            this.titolo = 'Aggiungi Preventivo';
        } else if (this.service.isEditing()) {
            this.titolo = 'Modifica Preventivo';
        } else {
            this.titolo = 'Dettaglio Preventivo';
        }
        if (this.preventivo) {
            this.refreshPagination();
        }
    }
    /** Metodo per il submit del form */
    saveData() {
        this.service.savePreventivo();
        this.back.emit();
    }
    startEdit() {
        this.service.editPreventivo();
    }
    cancel() {
        this.service.cancelEdit();
        this.back.emit();
    }
    doPrint() {
        if (this.preventivo)
            this.service.printPreventivo(this.preventivo);
    }
    doDelete() {
        if (this.preventivo) {
            this.service.deletePreventivo(this.preventivo);
            this.back.emit();
        }
    }
    doAddRow() {
        this.formHelper.addRiga(this.service.formPreventivo);
        this.refreshPagination();
        const totalRows = this.formHelper.getRighe(this.service.formPreventivo).length;
        this.dataPagService.goToCorrectPage(totalRows);
    }
    doDeleteRow(index: number) {
        if (this.preventivo) {
            this.formHelper.removeRiga(this.service.formPreventivo, index);
            this.refreshPagination();
        }
    }
    // Aggiorna le righe nel paginatore
    private refreshPagination() {
        const updatedRighe = this.formHelper.getRighe(this.service.formPreventivo)
            .controls.map((rigaFormGroup) => rigaFormGroup.getRawValue() as RighePreventivoModel);
        this.righeSignal.set(updatedRighe);
        this.dataPagService.updateDataWithoutResetPage(this.righeSignal);
    }
}