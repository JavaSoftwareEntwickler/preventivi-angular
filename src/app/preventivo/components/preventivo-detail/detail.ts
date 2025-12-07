import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreventivoForm } from '../preventivo-form/form';
import { PreventivoActions } from '../preventivo-actions/actions';
import { PreventiviService } from '../../services/preventivi.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PreventivoFormAdapter } from '../preventivo-form/PreventivoFormAdapter';
import { RighePreventivoModel } from '../../models/righe-preventivo-model';
import { PaginationService } from '../../../shared/services/pagination.service';


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
    righeSignal = signal<RighePreventivoModel[]>([]);

    constructor(
        public formAdapter: PreventivoFormAdapter,
        public svc: PaginationService<RighePreventivoModel>,
        public service: PreventiviService) {
    }
    // Metodo di inizializzazione
    // Ciclo di vita - ngOnInit
    ngOnInit(): void {
        if (this.preventivo) {
            console.log('ngOnInit dentro if preventivo Componente Standalone inizializzato');
            console.log("PreventivoDetail inizializzato, righe iniziali: ",
                this.formAdapter.getRighe(this.service.formPreventivo).controls.length);

            const righe = this.formAdapter.getRighe(this.service.formPreventivo)
                .controls.map((rigaFormGroup) => {
                    return rigaFormGroup.getRawValue() as RighePreventivoModel;
                });
            this.righeSignal.set(righe);  // Setta i dati nel servizio di paginazione
            this.svc.setDataStatic(this.righeSignal);  // Aggiorna i dati nel servizio di paginazione
        }
    }

    // Ciclo di vita - ngOnDestroy
    ngOnDestroy(): void {
        console.log('Componente Standalone distrutto');
    }
    startEdit() { this.service.editPreventivo(); }
    save() { this.service.savePreventivo(); this.back.emit(); }
    cancel() { this.service.cancelEdit(); this.back.emit(); }
    doPrint() { if (this.preventivo) this.service.printPreventivo(this.preventivo); }
    doDelete() { if (this.preventivo) this.service.deletePreventivo(this.preventivo); this.back.emit(); }
    /*     doAddRow() {
            if (this.preventivo) {
                this.formAdapter.addRiga(this.service.formPreventivo);
                //console.log(this.formAdapter);
    
            }
        } */
    doAddRow() {

        // Aggiungi una nuova riga al form
        this.formAdapter.addRiga(this.service.formPreventivo);
        console.log("Numero di righe dopo aggiunta: ", this.formAdapter.getRighe(this.service.formPreventivo).controls.length);
        console.log("righe dopo aggiunta: ", this.formAdapter.getRighe(this.service.formPreventivo).controls);

        // Estrai le righe aggiornate come oggetti
        const updatedRighe = this.formAdapter.getRighe(this.service.formPreventivo)
            .controls.map((rigaFormGroup) => rigaFormGroup.getRawValue() as RighePreventivoModel);

        // Aggiorna il Signal nel servizio di paginazione con le nuove righe
        this.righeSignal.set(updatedRighe);

        // Imposta i nuovi dati nel servizio di paginazione
        this.svc.setDataStatic(this.righeSignal);

        // Verifica che la paginazione venga aggiornata correttamente
        console.log("Numero righe paginazione:", this.svc.filtered());

    }
    doDeleteRow(index: number) { if (this.preventivo) { this.formAdapter.removeRiga(this.service.formPreventivo, index); } }

}