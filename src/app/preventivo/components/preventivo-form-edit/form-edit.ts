import { Component, EventEmitter, inject, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
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
    @Output() clone = new EventEmitter<void>();
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

    getFormGroupById(id: any): FormGroup {
        return this.frmAdapter
            .getRighe(this.service.formPreventivo)
            .controls
            .find(ctrl => ctrl.get('id')?.value === id) as FormGroup;
    }

    prev() {
        this.dataPagService.goToPage(this.dataPagService.currentPage() - 1);

    }
    next() {
        this.dataPagService.goToPage(this.dataPagService.currentPage() + 1);

    }

}