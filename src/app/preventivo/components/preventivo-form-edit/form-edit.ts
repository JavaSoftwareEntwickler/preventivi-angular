import { Component, EventEmitter, inject, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PreventivoFormService } from '../../services/form.service';
import { DynamicPaginationService } from '../../../shared/services/dynamic-pagination.service';
import { RighePreventivoModel } from '../../models/righe-preventivo-model';
import { PreventivoManagementService } from '../../services/preventivo-managment.service';


@Component({
    selector: 'app-preventivo-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form-edit.html',
    styleUrls: ['./form-edit.css']
})
export class PreventivoFormEditComponent implements OnChanges {

    @Input() preventivo: any | null = null;
    @Input() formPreventivo!: FormGroup;
    @Input() isEditing = false;
    @Output() deleteRow = new EventEmitter<number>();
    @Output() edit = new EventEmitter<void>();
    @Output() onSubmit = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();
    @Output() print = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();
    @Output() addRow = new EventEmitter<void>();
    isMobile = signal(window.innerWidth < 1058);

    constructor(
        public frmAdapter: PreventivoFormService,
        public dataPagService: DynamicPaginationService<RighePreventivoModel>,
        public service: PreventivoManagementService) {
    }

    ngOnInit() {
        window.addEventListener('resize', () => {
            this.isMobile.set(window.innerWidth < 1058);
        });
    }

    ngOnChanges(ch: SimpleChanges) {
        if (ch['preventivo'] && this.preventivo) {
            this.frmAdapter.patch(this.preventivo, this.formPreventivo);
            this.formPreventivo.disable();

        }
    }
    // Aggiorna le righe nel paginatore
    private refreshPagination() {
        const updatedRighe = this.frmAdapter.getRighe(this.service.formPreventivo)
            .controls.map((rigaFormGroup) => rigaFormGroup.getRawValue() as RighePreventivoModel);
        const righeSignal = signal<RighePreventivoModel[]>(updatedRighe);
        this.dataPagService.updateDataWithoutResetPage(righeSignal);
    }

    visibleRighe() {
        const start = (this.dataPagService.currentPage() - 1) * this.dataPagService.pageSize;
        const allRigheForm = this.frmAdapter.getRighe(this.service.formPreventivo).controls;
        const visibleRighe = allRigheForm.filter((ctrl, idx) => idx >= start && idx < start + this.dataPagService.pageSize);
        return visibleRighe.map((ctrl, idx) => {
            const realIndex = allRigheForm.findIndex(item => item === ctrl);
            const rowDataId = ctrl.getRawValue().id;
            return {
                ctrl,
                realIndex
            };
        });
    }
    trackByFn(index: number, item: any): number {
        return item.realIndex;  // Usa l'indice reale
    }

    prev() {
        this.dataPagService.goToPage(this.dataPagService.currentPage() - 1);

    }
    next() {
        this.dataPagService.goToPage(this.dataPagService.currentPage() + 1);

    }

}