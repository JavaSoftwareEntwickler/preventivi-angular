import { Injectable, signal, } from '@angular/core';
import { FormGroup, } from '@angular/forms';
import { concatMap, from, map, Observable, tap } from 'rxjs';
import { PreventivoModel } from '../models/preventivo-model';
import { PreventivoFormService } from './form.service';
import { RighePreventivoModel } from '../models/righe-preventivo-model';
import { PreventivoApiService } from './preventivo-api.service';
import { RighePreventivoApiService } from './righe-preventivo-api.service';
import { PdfApiService } from './pdf-api.service';

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
export class PreventivoManagementService {

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

    righePreventivoSignal = signal<RighePreventivoModel[]>([]);

    isPdfLoading = signal<boolean>(false);

    /** Form creato dal FormAdapter */
    formPreventivo: FormGroup;

    /** Costruttore che inietta :
     * -il servizio CrudServise generico 
     *  per eseguire il recupero di tutti i preventivi.
     * -il form adapter 
    */
    constructor(
        private apiPreventivoService: PreventivoApiService,
        private apiRighePreventivoService: RighePreventivoApiService,
        private preventivoFormService: PreventivoFormService,
        private preventivoPdfService: PdfApiService) {
        this.formPreventivo = this.preventivoFormService.buildForm();
        this.getPreventivi()
            .subscribe(data => {
                // Inizializza i preventivi
                this._preventivi.set(data.map(p => ({
                    id: p.id,
                    nomeCliente: p.nomeCliente,
                    dataPreventivo: p.dataPreventivo,
                    importoTotale: p.importoTotale,
                    righe: p.righe.map(r => ({
                        id: r.id,
                        descrizione: r.descrizione,
                        um: r.um,
                        quantita: r.quantita,
                        importo: r.importo,
                        importoTotale: r.importoTotale,
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
        return this.apiPreventivoService.getAll();
    }

    /** Getter pubblico per accedere ai preventivi */
    public get preventivi() { return this._preventivi; }

    // -------------------
    // Gestione Form (Reactive Forms)
    // -------------------


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
        this.isCreating.set(false);
        this.righePreventivoSignal.set(p.righe);
        this.preventivoFormService.patch(p, this.formPreventivo);
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
        this.preventivoFormService.abilitaRighe(this.formPreventivo); // Abilita le righe
    }

    /**
     * Annulla la modifica e ripristina i dati del preventivo
     */
    cancelEdit() {
        if (!this.selectedPreventivo()) return;
        this.isEditing.set(false);

        // Ripristina i valori originali del preventivo
        /** Ripristino patch tramite preventivoFormService */
        this.preventivoFormService.patch(this.selectedPreventivo()!, this.formPreventivo);

        // Disabilita il form
        this.formPreventivo.disable();
    }
    nuovoPreventivo_old() {
        this.selectedPreventivo.set(null);
        this.pageMode.set('detail');
        this.isCreating.set(true);
        this.isEditing.set(true);

        // Resetta il form per la creazione di un nuovo preventivo
        this.preventivoFormService.prepareFormForNew(this.formPreventivo);
    }

    /**
     * Inizializza la creazione di un nuovo preventivo
     */
    nuovoPreventivo(): Observable<boolean> {
        this.righePreventivoSignal.set([]);
        this.selectedPreventivo.set(null);
        this.pageMode.set('detail');
        this.isCreating.set(true);
        this.isEditing.set(true);
        // Resetta il form per la creazione di un nuovo preventivo
        this.preventivoFormService.prepareFormForNew(this.formPreventivo);
        return this.createEmptyRiga().pipe(tap(
            newRowDb => {
                this.righePreventivoSignal.update(r => [...r, newRowDb]);
                this.preventivoFormService.addRiga(this.formPreventivo, newRowDb);
            }),
            map(() => true));
    }

    /**
    * Funzione simulata per clonare il preventivo
    * @param p PreventivoModel con cui generare il clone
    */
    clonePreventivo(p: PreventivoModel): Observable<boolean> {
        //Setto gli stati come quelli in aggiunta di un nuovo preventivo
        console.log("clonePreventivo input righe preventivo: ", p.righe)
        // Cloniamo il preventivo senza modificare l'originale
        const preventivoClone: PreventivoModel = {
            ...p,
            righe: p.righe.map(r => ({ ...r, id: undefined }))
        };

        this.selectedPreventivo.set(null);
        this.pageMode.set('detail');
        this.isCreating.set(true);
        this.isEditing.set(true);

        this.preventivoFormService.prepareFormForClone(p, this.formPreventivo as FormGroup);

        const righePreventivo = preventivoClone.righe;
        preventivoClone.righe = [];
        this.righePreventivoSignal.set([]);
        console.log("clonePreventivo righe preventivo: dopo manipolazione clone", p.righe)
        return from(righePreventivo).pipe(
            concatMap(riga =>
                this.apiRighePreventivoService.create(riga).pipe(
                    tap(newRigaDb => {
                        this.righePreventivoSignal.update(r => [...r, newRigaDb]);
                        preventivoClone.righe.push(newRigaDb);
                        this.preventivoFormService.addRiga(this.formPreventivo as FormGroup, newRigaDb);
                    })
                )
            ), map(() => true)
        );
    }

    /**
     * Creazione o Update del preventivo:
     * -Salva un nuovo preventivo o aggiorna un preventivo esistente
     * -Imposta lo stato dei segnali
     * -Aggiorna il preventivo alla lista locale signal
     */
    savePreventivo() {
        const formValuePerSignal = this.preventivoFormService.mapToModel(this.formPreventivo);
        // Se stiamo creando un nuovo preventivo
        if (this.isCreating()) {
            // Chiamata al servizio per creare il preventivo
            this.creaPreventivo(formValuePerSignal);
        }
        // Se stiamo aggiornando un preventivo esistente
        if (this.isEditing() && this.selectedPreventivo()) {
            this.aggiornaPreventivo(formValuePerSignal);
        }
    }

    private creaPreventivo(formValuePerSignal: PreventivoModel) {
        this.apiPreventivoService.create(formValuePerSignal).subscribe({
            next: (preventivoCreato) => {
                formValuePerSignal.id = preventivoCreato.id;
                // Aggiungi il preventivo alla lista locale signal
                this._preventivi.set([...this._preventivi(), preventivoCreato]);
                // Imposta lo stato dei segnali
                this.isCreating.set(false);
                this.isEditing.set(false);
                this.selectedPreventivo.set(formValuePerSignal);
                this.formPreventivo.disable();
            }
        });
    }

    private aggiornaPreventivo(formValuePerSignal: PreventivoModel) {
        const updated = { ...this.selectedPreventivo()!, ...formValuePerSignal };
        this.apiPreventivoService.update(formValuePerSignal.id, formValuePerSignal).subscribe({
            next: (preventivoAggiornato) => {
                // Aggiorna il preventivo alla lista locale signal
                // Sostituisci il vecchio preventivo con quello aggiornato che contiene le righe con gli ID restituiti dal ApiSerivice
                this._preventivi.set(this._preventivi().map(p =>
                    p.id === preventivoAggiornato.id
                        ? { ...p, ...preventivoAggiornato, righe: preventivoAggiornato.righe }
                        : p
                ));
                // Imposta lo stato dei segnali
                this.isEditing.set(false);
                this.formPreventivo.disable();
            }
        });

    }

    /**
     * Elimina un preventivo dal sistema
     * @param p Preventivo da eliminare
     */
    deletePreventivo(p: PreventivoModel) {
        const ok = confirm('Confermi di voler eliminare il preventivo ID ' + p.id + '?');
        if (ok) {
            this._preventivi.set(this._preventivi().filter(x => x.id !== p.id));
            this.apiPreventivoService.delete(p.id).subscribe({});
            this.righePreventivoSignal.set([]);
            this.backToList();
        }
    }

    removeRigaPreventivoSignalById(id: number) {
        this.righePreventivoSignal.update(r => r.filter(x => x.id !== id));
    }
    deleteRigaPreventivoById(id: number): Observable<RighePreventivoModel> {
        return this.apiRighePreventivoService.delete(id);
    }

    createEmptyRiga(): Observable<RighePreventivoModel> {
        var newRiga: RighePreventivoModel = {
            id: undefined,
            descrizione: "",
            um: '',
            quantita: 1,
            importo: 1,
            importoTotale: 1
        }
        return this.apiRighePreventivoService.create(newRiga);
    }

    /**
     * Funzione simulata per generare un PDF del preventivo
     * @param p Preventivo di cui generare il PDF
     */
    printPreventivo(p: PreventivoModel) {
        this.isPdfLoading.set(true);
        this.preventivoPdfService.getPdfPreventivo(p.id).subscribe(blob => {
            const url = URL.createObjectURL(blob);
            window.open(url);
            this.isPdfLoading.set(false);
        });
    }

}
