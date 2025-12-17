import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PreventivoModel } from '../models/preventivo-model';
import { Subject } from 'rxjs/internal/Subject';
import { positiveNumberValidator } from '../../shared/helper/validators-helper';
import { DatePipe } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class PreventivoFormService {

    private destroy$ = new Subject<void>();  // Subject per gestire la disiscrizione

    constructor(
        private fb: FormBuilder,
        private datePipe: DatePipe
    ) { }

    /** Costruzione form */
    buildForm() {
        const oggi = new Date();
        return this.fb.group({
            id: [{ value: 0, disabled: true }],
            nomeCliente: ['', Validators.required],
            dataPreventivo: [this.datePipe.transform(oggi, 'yyyy-MM-dd'), [Validators.required]],
            importoTotale: [0, [Validators.required, positiveNumberValidator()]],
            righe: this.fb.array([]),
        });
    }

    /** Mapping model → form */
    patch(model: PreventivoModel, form: any) {
        form.patchValue({
            id: model.id,
            nomeCliente: model.nomeCliente,
            dataPreventivo: this.datePipe.transform(model.dataPreventivo, 'yyyy-MM-dd'),
            importoTotale: model.importoTotale,
        });

        // Resetta e popola le righe del preventivo
        const righeFA = form.get('righe') as FormArray;
        righeFA.clear();
        model.righe.forEach(r => {
            righeFA.push(this.createRiga(r));  // <-- AUTO-CALCOLO RESTA ATTIVO
        });
    }

    /** Mapping form → model */
    mapToModel(form: any): PreventivoModel {
        const raw = form.getRawValue();
        // Stampa il valore grezzo del form
        return {
            ...raw,
            righe: raw.righe.map((r: any) => ({
                id: r.id,
                descrizione: r.descrizione,
                um: r.um,
                quantita: r.quantita,
                importo: r.importo,
                importoTotale: r.importoTotale,
            }))
        };
    }

    /**
     * Prepara il form per un nuovo preventivo
     * - Resetta i campi del form
     * - Aggiunge una riga vuota per l'inserimento di una riga al preventivo
     */
    prepareFormForNew(form: FormGroup) {
        form.reset({
            id: null,
            nomeCliente: '',
            dataPreventivo: this.datePipe.transform(Date.now(), 'yyyy-MM-dd'),
            importoTotale: 1
        });

        // Resetta e aggiungi una riga vuota
        this.resetRighe(form);
        //this.addRiga(form);  

        form.enable();
        form.controls['id'].disable();
    }

    // -------------------------------
    // GESTIONE RIGHE (isolata e pulita)
    // -------------------------------
    getRighe(form: FormGroup): FormArray {
        return form.get('righe') as FormArray;
    }

    abilitaRighe(form: FormGroup) {
        this.getRighe(form).controls.forEach(ctrl => ctrl.enable());
    }

    /**
     * Aggiusta i commenti
     * Crea un form group per una singola riga del preventivo
     * @param r Riga del preventivo da trasformare in form group
     * @returns FormGroup per la riga
     */
    createRiga(r?: {
        id?: number,
        descrizione: string,
        um: string,
        quantita: number,
        importo: number,
        importoTotale: number
    }): FormGroup {

        const fg = this.fb.group({
            id: r?.id,
            descrizione: [r?.descrizione ?? '', Validators.required],
            um: [r?.um ?? '', Validators.required],
            quantita: [r?.quantita ?? 1, [Validators.required, positiveNumberValidator()]],
            importo: [r?.importo ?? 1, [Validators.required, positiveNumberValidator()]],
            importoTotale: [{ value: r?.importoTotale ?? 1, disabled: false }, [Validators.required, positiveNumberValidator()]]
        });

        // Auto-calcolo:
        fg.get('quantita')!.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateTotaleRiga(fg));
        fg.get('importo')!.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateTotaleRiga(fg));

        return fg;
    }


    addRiga(form: FormGroup,
        r?: {
            id?: number,
            descrizione: string,
            um: string,
            quantita: number,
            importo: number,
            importoTotale: number,
        }) {
        const righeFA = this.getRighe(form); // Otteniamo il FormArray delle righe
        const newRiga = this.createRiga(r); // Creiamo una nuova riga

        righeFA.push(newRiga); // Aggiungi la nuova riga al FormArray

        // Forza il calcolo del totale subito dopo l'aggiunta
        this.updateTotaleRiga(newRiga);
    }

    removeRiga(form: FormGroup, index: number) {
        this.getRighe(form).removeAt(index);  // Rimuovi la riga dal FormArray

        // Dopo la rimozione, aggiorniamo il totale del preventivo
        const righeFA = this.getRighe(form); // Otteniamo il FormArray delle righe
        this.updateTotalePreventivo(righeFA); // Ricalcoliamo il totale
    }
    removeRigaById(form: FormGroup, id: number) {
        const righe = this.getRighe(form);
        const index = righe.controls.findIndex(c => c.get('id')?.value === id);
        if (index >= 0) righe.removeAt(index);
        this.updateTotalePreventivo(this.getRighe(form));
    }

    resetRighe(form: FormGroup) {
        this.getRighe(form).clear();
    }

    /** calcolo automatio degli importi totali delle righe */
    private updateTotaleRiga(fg: FormGroup) {
        const q = Number(fg.get('quantita')!.value) || 0;
        const p = Number(fg.get('importo')!.value) || 0;
        const tot = q * p;

        fg.get('importoTotale')!.setValue(tot, { emitEvent: false });

        // Aggiorna il totale del preventivo
        if (fg.parent) {
            this.updateTotalePreventivo(fg.parent as FormArray);
        }
    }
    /** calcolo automatio dell'importo del preventivo */
    private updateTotalePreventivo(righeFA: FormArray) {
        const totaleGenerale = righeFA.controls
            .reduce((acc, ctrl) =>
                acc + (Number(ctrl.get('importoTotale')!.value) || 0), 0
            );

        const parent = righeFA.parent as FormGroup;

        parent.get('importoTotale')!.setValue(totaleGenerale, { emitEvent: false });
    }

}

