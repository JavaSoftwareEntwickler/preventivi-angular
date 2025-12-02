import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PreventivoModel } from '../../models/preventivo-model';

@Injectable({ providedIn: 'root' })
export class PreventivoFormAdapter {

    constructor(private fb: FormBuilder) { }

    /** Costruzione form */
    buildForm() {
        return this.fb.group({
            id: [{ value: 0, disabled: true }],
            nomeCliente: ['', Validators.required],
            dataPreventivo: ['', Validators.required],
            importoTotale: [0, [Validators.required, Validators.min(0)]],
            righe: this.fb.array([]),
        });
    }

    /** Mapping model → form */
    patch(model: PreventivoModel, form: any) {
        form.patchValue({
            id: model.id,
            nomeCliente: model.nomeCliente,
            dataPreventivo: model.dataPreventivo,
            importoTotale: model.importoTotale,
        });

        // Resetta e popola le righe del preventivo
        form.get('righe').clear();
        model.righe.forEach(r =>
            form.get('righe').push(
                this.fb.group({
                    id: r.id,
                    descrizione: [r.descrizione, Validators.required],
                    um: [r.um, Validators.required],
                    quantita: [r.quantita, Validators.required],
                    importo: [r.importo, Validators.required],
                    importoTotale: [r.importoTotale, Validators.required]
                })
            )
        );
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
            dataPreventivo: '',
            importoTotale: 0
        });

        // Resetta e aggiungi una riga vuota
        this.resetRighe(form);
        this.addRiga(form);  // Aggiungi una riga vuota

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
    createRiga(r?: { id: number, descrizione: string; um: string, quantita: number, importo: number, importoTotale: number }): FormGroup {
        return this.fb.group({
            id: r?.id,
            descrizione: [r?.descrizione ?? '', Validators.required],
            um: [r?.um ?? '', Validators.required],
            quantita: [r?.quantita ?? 1, Validators.required],
            importo: [r?.importo ?? 1, Validators.required],
            importoTotale: [r?.importoTotale ?? 1, Validators.required]
        });
    }

    addRiga(form: FormGroup,
        r?: {
            id: number,
            descrizione: string,
            um: string,
            quantita: number,
            importo: number,
            importoTotale: number,
        }) {
        this.getRighe(form).push(this.createRiga(r));
    }

    removeRiga(form: FormGroup, index: number) {
        this.getRighe(form).removeAt(index);
    }

    resetRighe(form: FormGroup) {
        this.getRighe(form).clear();
    }

}
