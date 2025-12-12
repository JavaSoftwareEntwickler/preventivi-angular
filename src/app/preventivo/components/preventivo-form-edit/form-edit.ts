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

        // Settiamo i dati per il PaginationService
        // Estrai le righe come oggetti (non form controls) di tipo RighePreventivoModel
        const righe = this.frmAdapter.getRighe(this.service.formPreventivo)
            .controls.map((rigaFormGroup) => {
                return rigaFormGroup.getRawValue() as RighePreventivoModel;
            });

        // Crea un Signal correttamente tipizzato
        const righeSignal = signal<RighePreventivoModel[]>(righe);

        // Setta il Signal al PaginationService
        this.dataPagService.setData(righeSignal);
    }

    ngOnInit() {
        // console.log('ngOnInit  Componente Form Standalone inizializzato');
        window.addEventListener('resize', () => {
            this.isMobile.set(window.innerWidth < 1058);
        });
    }
    // Ciclo di vita - ngOnDestroy
    ngOnDestroy(): void {
        // console.log('Componente Form Standalone distrutto');
    }

    ngOnChanges(ch: SimpleChanges) {
        if (ch['preventivo'] && this.preventivo) {
            this.frmAdapter.patch(this.preventivo, this.formPreventivo);
            this.formPreventivo.disable();
        }
    }

    visibleRighe() {
        //console.log("sono in visibleRighe")
        const start = (this.dataPagService.currentPage() - 1) * this.dataPagService.pageSize;
        const allRighe = this.frmAdapter.getRighe(this.formPreventivo).controls;
        return allRighe.slice(start, start + this.dataPagService.pageSize)
            .map((ctrl, idx) => ({
                ctrl,
                realIndex: start + idx
            }));
    }
    trackByFn(index: number, item: any): number {
        //console.log("sono in trackByFn")
        return item.realIndex;  // Usa un identificativo unico, in questo caso `realIndex`
    }

    prev() {
        this.dataPagService.goToPage(this.dataPagService.currentPage() - 1);

    }
    next() {
        this.dataPagService.goToPage(this.dataPagService.currentPage() + 1);

    }

}