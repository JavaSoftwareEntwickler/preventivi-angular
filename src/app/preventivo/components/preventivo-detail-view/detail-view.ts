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
    titolo: string = '';

    constructor(
        public formService: PreventivoFormService,
        public dataPagService: DynamicPaginationService<RighePreventivoModel>,
        public service: PreventivoManagementService) {
        this.dataPagService.setData(this.service.righePreventivoSignal);
    }
    ngOnInit(): void {

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
    doClone() {
        if (this.preventivo)
            this.service.clonePreventivo(this.preventivo);
    }
    doDelete() {
        if (this.preventivo) {
            this.service.deletePreventivo(this.preventivo);
            this.back.emit();
        }
    }
    doAddRow_old() {
        this.formService.addRiga(this.service.formPreventivo);
        const totalRows = this.formService.getRighe(this.service.formPreventivo).length;
        this.dataPagService.goToCorrectPage(totalRows);
    }
    doAddRow() {
        this.service.createEmptyRiga().subscribe(newRowDb => {
            this.service.righePreventivoSignal.update(r => [...r, newRowDb]);
            this.formService.addRiga(this.service.formPreventivo, newRowDb);
            const totRow = this.dataPagService.filtered().length;
            console.log({ totRow })
            console.log(this.dataPagService.totalPages())
            this.dataPagService.goToCorrectPage(totRow);
        });
    }
    doDeleteRow(id: number) {
        this.service.deleteRigaPreventivoById(id).subscribe(rowDeleted => {
            this.formService.removeRigaById(this.service.formPreventivo, id);
            this.service.removeRigaPreventivoSignalById(id);
        });

    }
}