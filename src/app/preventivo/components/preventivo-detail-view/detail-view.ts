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
    // Metodo di inizializzazione
    // Ciclo di vita - ngOnInit
    ngOnInit(): void {
        // Imposta il titolo in base alla modalità
        if (this.service.isCreating()) {
            this.titolo = 'Aggiungi Preventivo';
        } else if (this.service.isEditing()) {
            this.titolo = 'Modifica Preventivo';
        } else {
            this.titolo = 'Dettaglio Preventivo';
        }
        if (this.preventivo) {
            // console.log("ngOnInit dentro if preventivo Componente Standalone inizializzato");
            // console.log("PreventivoDetail inizializzato, righe iniziali: ", this.formHelper.getRighe(this.service.formPreventivo).controls.length);

            const righe = this.formHelper.getRighe(this.service.formPreventivo)
                .controls.map((rigaFormGroup) => {
                    return rigaFormGroup.getRawValue() as RighePreventivoModel;
                });
            this.righeSignal.set(righe);  // Setta i dati nel servizio di paginazione
            this.dataPagService.setDataStatic(this.righeSignal);  // Aggiorna i dati nel servizio di paginazione
        }
    }
    /** Metodo per il submit del form */
    saveData() {
        this.service.savePreventivo();
        this.back.emit();
    }
    // Ciclo di vita - ngOnDestroy
    ngOnDestroy(): void {
        // console.log('Componente Standalone distrutto');
    }
    /** Controlla che tutte le righe siano valide */
    areRigheValid(): boolean {
        const righeFA = this.service.formPreventivo.get('righe') as FormArray;
        //console.log("formPreventivo.valid", this.service.formPreventivo.valid)
        //console.log("righeFA.controls", righeFA.controls)
        return righeFA.controls.every(control => control.valid);
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
    /*     doAddRow() {
            if (this.preventivo) {
                this.formHelper.addRiga(this.service.formPreventivo);
                //console.log(this.formHelper);
     
            }
        } */
    doAddRow() {

        // Aggiungi una nuova riga al form
        this.formHelper.addRiga(this.service.formPreventivo);
        //console.log("Numero di righe dopo aggiunta: ", this.formHelper.getRighe(this.service.formPreventivo).controls.length);
        //console.log("righe dopo aggiunta: ", this.formHelper.getRighe(this.service.formPreventivo).controls);

        // Estrai le righe aggiornate come oggetti
        const updatedRighe = this.formHelper.getRighe(this.service.formPreventivo)
            .controls.map((rigaFormGroup) => rigaFormGroup.getRawValue() as RighePreventivoModel);

        // Aggiorna il Signal nel servizio di paginazione con le nuove righe
        this.righeSignal.set(updatedRighe);

        // Imposta i nuovi dati nel servizio di paginazione
        //this.dataPagService.setDataStatic(this.righeSignal);
        //console.log(this.dataPagService.currentPage())
        this.dataPagService.updateDataWithoutResetPage(this.righeSignal);

        // Verifica che la paginazione venga aggiornata correttamente
        //console.log("Numero righe paginazione:", this.dataPagService.filtered());

    }
    doDeleteRow(index: number) {
        if (this.preventivo) {
            this.formHelper.removeRiga(this.service.formPreventivo, index);
        }
    }

}