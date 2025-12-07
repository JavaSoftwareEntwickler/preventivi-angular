import { Component, EventEmitter, inject, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PreventivoFormAdapter } from './PreventivoFormAdapter';
import { PaginationService } from '../../../shared/services/pagination.service';
import { RighePreventivoModel } from '../../models/righe-preventivo-model';
import { PreventiviService } from '../../services/preventivi.service';
import { ActivatedRoute } from '@angular/router';


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
    isMobile = signal(window.innerWidth < 1058);

    constructor(
        public frmAdapter: PreventivoFormAdapter,
        public svc: PaginationService<RighePreventivoModel>,
        public service: PreventiviService) {

        // Settiamo i dati per il PaginationService
        // Estrai le righe come oggetti (non form controls) di tipo RighePreventivoModel
        const righe = this.frmAdapter.getRighe(this.service.formPreventivo)
            .controls.map((rigaFormGroup) => {
                return rigaFormGroup.getRawValue() as RighePreventivoModel;
            });

        // Crea un Signal correttamente tipizzato
        const righeSignal = signal<RighePreventivoModel[]>(righe);

        // Setta il Signal al PaginationService
        this.svc.setData(righeSignal);
    }

    ngOnInit() {
        console.log('ngOnInit  Componente Form Standalone inizializzato');
        window.addEventListener('resize', () => {
            this.isMobile.set(window.innerWidth < 1058);
        });
    }
    // Ciclo di vita - ngOnDestroy
    ngOnDestroy(): void {
        console.log('Componente Form Standalone distrutto');
    }

    ngOnChanges(ch: SimpleChanges) {
        if (ch['preventivo'] && this.preventivo) {
            this.frmAdapter.patch(this.preventivo, this.formPreventivo);
            this.formPreventivo.disable();
        }
    }

    visibleRighe() {
        console.log("sono in visibleRighe")
        const start = (this.svc.currentPage() - 1) * this.svc.pageSize;
        const allRighe = this.frmAdapter.getRighe(this.formPreventivo).controls;
        return allRighe.slice(start, start + this.svc.pageSize)
            .map((ctrl, idx) => ({
                ctrl,
                realIndex: start + idx
            }));
    }
    trackByFn(index: number, item: any): number {
        console.log("sono in trackByFn")
        return item.realIndex;  // Usa un identificativo unico, in questo caso `realIndex`
    }


    prev() { this.svc.goToPage(this.svc.currentPage() - 1); }
    next() { this.svc.goToPage(this.svc.currentPage() + 1); }
}