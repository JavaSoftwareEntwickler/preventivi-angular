import { Injectable, signal, computed, effect } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PreventivoModel } from '../models/preventivo-model';
import { CrudService } from '../../shared/services/crud.service';

/**
 * Servizio di gestione dei preventivi.
 *
 * Responsabilità:
 * - Recupero e gestione dei dati relativi ai preventivi
 * - Gestione dei form per la creazione, modifica ed eliminazione dei preventivi
 * - Gestione dello stato di visualizzazione (list, detail)
 * - Gestione delle righe del preventivo in un FormArray reattivo
 *
 * Il servizio sfrutta il `CrudService` generico per eseguire operazioni CRUD 
 * sui preventivi, migliorando la riusabilità e la manutenibilità del codice.
 *
 * @see PreventivoModel Modello dei dati di un preventivo
 */
@Injectable({ providedIn: 'root' })
export class PreventiviService {

    /** Segnale per gestire la modalità di visualizzazione corrente (list o detail) */
    pageMode = signal<'list' | 'detail'>('list');

    /** Segnale per il preventivo selezionato (null se nessun preventivo è selezionato) */
    selectedPreventivo = signal<PreventivoModel | null>(null);

    /** Segnale che indica se si sta creando un nuovo preventivo */
    isCreating = signal<boolean>(false);

    /** URL base per la comunicazione con l'API REST */
    url = 'http://localhost:8088';

    /** Lista dei preventivi in memoria */
    private _preventivi = signal<PreventivoModel[]>([]);

    /** Costruttore che inietta il servizio CrudServise generico 
     * per eseguire il recupero di tutti i preventivi.
    */
    constructor(private crudService: CrudService<PreventivoModel>) {
        this.crudService.setApiUrl(`${this.url}/preventivi`);
        this.getPreventivi()
            .subscribe(data => {
                // Inizializza i preventivi
                this._preventivi.set(data.map(p => ({
                    id: p.id,
                    nomeCliente: p.nomeCliente,
                    dataPreventivo: p.dataPreventivo,
                    importoTotale: p.importoTotale,
                    righe: p.righe.map(r => ({
                        descrizione: r.descrizione,
                        quantita: r.quantita
                    }))
                } as PreventivoModel)))
            });
    }

    /**
     * * Recupera i preventivi tramite il servizio CrudService, 
     *  che gestisce la chiamata HTTP GET.
     * @returns Observable contenente un array di PreventivoModel
     */
    public getPreventivi(): Observable<PreventivoModel[]> {
        return this.crudService.getAll();
    }

    /** Getter pubblico per accedere ai preventivi */
    public get preventivi() { return this._preventivi; }

    // -------------------
    // Gestione Form (Reactive Forms)
    // -------------------

    /** Costruttore del FormBuilder per la creazione dei form */
    fb = new FormBuilder();

    /** Form di gestione del preventivo */
    formPreventivo = this.fb.group({
        id: [{ value: 0, disabled: true }],
        nomeCliente: [{ value: '', disabled: true }, Validators.required],
        dataPreventivo: [{ value: '', disabled: true }, Validators.required],
        importoTotale: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
        righe: this.fb.array([])  // <-- aggiunto per gestire le righe del preventivo
    });

    // -------------------
    // Funzioni CRUD (Create, Read, Update, Delete)
    // -------------------

    /**
     * Apre i dettagli di un preventivo e popola il form con i dati
     * @param p Preventivo da visualizzare
     */
    openDetails(p: PreventivoModel) {
        this.selectedPreventivo.set(p);
        this.pageMode.set('detail');
        this.isEditing.set(false);

        // Popola il form con i dettagli del preventivo selezionato
        this.formPreventivo.patchValue({
            id: p.id,
            nomeCliente: p.nomeCliente,
            dataPreventivo: p.dataPreventivo,
            importoTotale: p.importoTotale
        });

        // Resetta e popola le righe del preventivo
        this.righeFormArray.clear();
        p.righe.forEach(r => this.righeFormArray.push(this.createRiga(r)));

        // Disabilita il form per la visualizzazione dei dettagli
        this.formPreventivo.disable();
    }

    /** Torna alla lista dei preventivi */
    backToList() {
        this.pageMode.set('list');
        this.selectedPreventivo.set(null);
    }

    // -------------------
    // Gestione Modifica (Editing)
    // -------------------

    /** Segnale per gestire lo stato di editing */
    isEditing = signal<boolean>(false);

    /**
     * Abilita il form per la modifica del preventivo
     */
    editPreventivo() {
        this.isEditing.set(true);
        this.formPreventivo.enable();
        this.formPreventivo.controls['id'].disable(); // Il campo ID non può essere modificato
        this.righeFormArray.controls.forEach(ctrl => ctrl.enable()); // Abilita le righe
    }

    /**
     * Annulla la modifica e ripristina i dati del preventivo
     */
    cancelEdit() {
        if (!this.selectedPreventivo()) return;
        this.isEditing.set(false);

        // Ripristina i valori originali del preventivo
        this.formPreventivo.patchValue(this.selectedPreventivo()!);

        // Ripristina le righe
        this.righeFormArray.clear();
        this.selectedPreventivo()!.righe.forEach(r => this.righeFormArray.push(this.createRiga(r)));

        // Disabilita il form
        this.formPreventivo.disable();
    }

    /**
     * Salva un nuovo preventivo o aggiorna un preventivo esistente
     */
    savePreventivo() {
        const formValue = this.formPreventivo.getRawValue() as PreventivoModel;

        // Se stiamo creando un nuovo preventivo
        if (this.isCreating()) {
            this._preventivi.set([...this._preventivi(), formValue]);
            this.isCreating.set(false);
            this.isEditing.set(false);
            this.selectedPreventivo.set(formValue);
            this.formPreventivo.disable();
            return;
        }

        // Se stiamo aggiornando un preventivo esistente
        if (this.selectedPreventivo()) {
            const updated = { ...this.selectedPreventivo()!, ...formValue };
            this._preventivi.set(this._preventivi().map(p => p.id === updated.id ? updated : p));
            this.isEditing.set(false);
            this.formPreventivo.disable();
        }
    }

    /**
     * Elimina un preventivo dal sistema
     * @param p Preventivo da eliminare
     */
    deletePreventivo(p: PreventivoModel) {
        const ok = confirm('Confermi di voler eliminare il preventivo ID ' + p.id + '?');
        if (ok) {
            this._preventivi.set(this._preventivi().filter(x => x.id !== p.id));
            this.backToList();
        }
    }

    /**
     * Funzione simulata per generare un PDF del preventivo
     * @param p Preventivo di cui generare il PDF
     */
    printPreventivo(p: PreventivoModel) {
        alert('Generazione PDF simulata per preventivo ID: ' + p.id);
    }

    /**
     * Inizializza la creazione di un nuovo preventivo
     */
    nuovoPreventivo() {
        this.selectedPreventivo.set(null);
        this.pageMode.set('detail');
        this.isCreating.set(true);
        this.isEditing.set(true);

        // Assegna un nuovo ID al preventivo
        const newId = Math.max(...this._preventivi().map(p => p.id)) + 1;

        // Resetta il form per la creazione di un nuovo preventivo
        this.formPreventivo.reset({
            id: newId,
            nomeCliente: '',
            dataPreventivo: '',
            importoTotale: 0
        });

        this.formPreventivo.enable();
        this.formPreventivo.controls['id'].disable();
    }

    // -------------------
    // Gestione delle righe del preventivo
    // -------------------

    /** Helper per ottenere l'array delle righe nel form */
    get righeFormArray(): FormArray { return this.formPreventivo.get('righe') as FormArray; }

    /**
     * Crea un form group per una singola riga del preventivo
     * @param r Riga del preventivo da trasformare in form group
     * @returns FormGroup per la riga
     */
    private createRiga(r: { descrizione: string; quantita: number }) {
        return this.fb.group({
            descrizione: [{ value: r.descrizione, disabled: true }, Validators.required],
            quantita: [{ value: r.quantita, disabled: true }, Validators.required]
        });
    }

}
