import { Injectable, signal, computed, effect } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IPreventivo } from '../../../../../server-be/models/IPreventivo';
import { toSignal } from '@angular/core/rxjs-interop';
import { PreventivoModel } from '../models/preventivo-model';

//export interface PreventivoModel { id: number; nomeCliente: string; dataPreventivo: string; importoTotale: number; righe: RighePreventivoModel[] }
//export interface RighePreventivoModel { descrizione: string; quantita: number; }
//export interface RighePreventivoModel { descrizione: string; quantita: number; um: String; importo: number; }

@Injectable({ providedIn: 'root' })
export class PreventiviService {
    // page mode + selected
    pageMode = signal<'list' | 'detail'>('list');
    selectedPreventivo = signal<PreventivoModel | null>(null);
    isCreating = signal<boolean>(false);
    url = 'http://localhost:8088';
    _preventivi = signal<PreventivoModel[]>([]);

    constructor(private http: HttpClient) {
        this.getPreventivi()
            .subscribe(data => {
                this._preventivi.set(data.map(p => ({
                    id: p.id,
                    nomeCliente: p.nomeCliente,
                    dataPreventivo: p.dataPreventivo,
                    importoTotale: p.importoTotale,
                    righe: [{ descrizione: 'Demolizione', quantita: 3 }]
                } as PreventivoModel)))
            });
    }

    public getPreventivi(): Observable<IPreventivo[]> {
        return this.http.get<{ status: string, data: IPreventivo[] }>(`${this.url}/preventivi`).pipe(map(response => response.data))
    }

    // expose convenience getters (for templates)
    public get preventivi() { return this._preventivi; }

    /*dati master
    private _preventivi = signal<PreventivoModel[]>([
        { id: 1, nomeCliente: 'Mario Rossi', dataPreventivo: '2025-01-14', importoTotale: 1200.50, righe: [{ descrizione: 'Demolizione', quantita: 3 }, { descrizione: 'Imbianchino', quantita: 1 }, { descrizione: 'Imbianchino', quantita: 1 }, { descrizione: 'Imbianchino', quantita: 1 }] },
        { id: 2, nomeCliente: 'Azienda Bianchi asdfasdfasdfasdf SRL', dataPreventivo: '2025-01-18', importoTotale: 4500.00, righe: [{ descrizione: 'Demolizione', quantita: 3 }] },
        { id: 3, nomeCliente: 'Luca Verdi', dataPreventivo: '2025-02-03', importoTotale: 890.00, righe: [{ descrizione: 'Demolizione', quantita: 3 }] },
        { id: 4, nomeCliente: 'Studio Gamma', dataPreventivo: '2025-02-10', importoTotale: 2300.00, righe: [{ descrizione: 'Demolizione', quantita: 3 }] },
        { id: 5, nomeCliente: 'Sigma Love', dataPreventivo: '2025-02-06', importoTotale: 700.00, righe: [{ descrizione: 'Demolizione', quantita: 3 }] },
        { id: 6, nomeCliente: 'Sigma Pippo', dataPreventivo: '2025-08-02', importoTotale: 1230.00, righe: [{ descrizione: 'Demolizione', quantita: 3 }] },
        { id: 7, nomeCliente: 'Sigma Rozzo', dataPreventivo: '2025-08-12', importoTotale: 5235120.00, righe: [{ descrizione: 'Demolizione', quantita: 3 }] },
        { id: 8, nomeCliente: 'Gino Ginello', dataPreventivo: '2025-09-12', importoTotale: 534560.00, righe: [{ descrizione: 'Demolizione', quantita: 3 }] },
        { id: 9, nomeCliente: 'Ciccio Pasticcio', dataPreventivo: '2025-09-12', importoTotale: 5103450.00, righe: [{ descrizione: 'Demolizione', quantita: 3 }] },
        { id: 10, nomeCliente: 'Love you', dataPreventivo: '2025-10-12', importoTotale: 5103330.00, righe: [{ descrizione: 'Demolizione', quantita: 3 }] },
        { id: 11, nomeCliente: 'I am', dataPreventivo: '2025-11-12', importoTotale: 151890.00, righe: [{ descrizione: 'Demolizione', quantita: 3 }] }
    ]);
    /*/

    // reactive form
    fb = new FormBuilder();
    formPreventivo = this.fb.group({
        id: [{ value: 0, disabled: true }],
        nomeCliente: [{ value: '', disabled: true }, Validators.required],
        dataPreventivo: [{ value: '', disabled: true }, Validators.required],
        importoTotale: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
        righe: this.fb.array([])  // <-- aggiunto qui
    });

    // CRUD / navigation
    openDetails(p: PreventivoModel) {
        this.selectedPreventivo.set(p);
        this.pageMode.set('detail');
        this.isEditing.set(false);

        this.formPreventivo.patchValue({
            id: p.id,
            nomeCliente: p.nomeCliente,
            dataPreventivo: p.dataPreventivo,
            importoTotale: p.importoTotale
        });

        // reset e popolamento righe
        this.righeFormArray.clear();
        p.righe.forEach(r => this.righeFormArray.push(this.createRiga(r)));

        this.formPreventivo.disable();
    }

    backToList() {
        this.pageMode.set('list');
        this.selectedPreventivo.set(null);
    }


    // editing state
    isEditing = signal<boolean>(false);
    editPreventivo() {
        this.isEditing.set(true);
        this.formPreventivo.enable();
        this.formPreventivo.controls['id'].disable();
        this.righeFormArray.controls.forEach(ctrl => ctrl.enable());
    }
    cancelEdit() {
        if (!this.selectedPreventivo()) return;
        this.isEditing.set(false);

        this.formPreventivo.patchValue(this.selectedPreventivo()!);

        this.righeFormArray.clear();
        this.selectedPreventivo()!.righe.forEach(r => this.righeFormArray.push(this.createRiga(r)));

        this.formPreventivo.disable();
    }

    /*
        savePreventivo() {
            if (!this.selectedPreventivo()) return;
            const updated = { 
                ...this.selectedPreventivo()!,
                ...this.formPreventivo.getRawValue() 
            } as PreventivoModel;
            this._preventivi.set(this._preventivi().map(p => p.id === updated.id ? updated : p));
            this.isEditing.set(false);
            this.formPreventivo.disable();
        }
            */
    savePreventivo() {

        const formValue = this.formPreventivo.getRawValue() as PreventivoModel;

        // INSERT
        if (this.isCreating()) {
            this._preventivi.set([...this._preventivi(), formValue]);
            this.isCreating.set(false);
            this.isEditing.set(false);
            this.selectedPreventivo.set(formValue);
            this.formPreventivo.disable();
            return;
        }

        // UPDATE
        if (this.selectedPreventivo()) {
            const updated = { ...this.selectedPreventivo()!, ...formValue };

            this._preventivi.set(
                this._preventivi().map(p => p.id === updated.id ? updated : p)
            );

            this.isEditing.set(false);
            this.formPreventivo.disable();
        }
    }

    deletePreventivo(p: PreventivoModel) {
        const ok = confirm('Confermi di voler eliminare il preventivo ID ' + p.id + '?');
        if (ok) {
            this._preventivi.set(this._preventivi().filter(x => x.id !== p.id));
            this.backToList();
        }
    }
    printPreventivo(p: PreventivoModel) { alert('Generazione PDF simulata per preventivo ID: ' + p.id); }

    nuovoPreventivo() {
        this.selectedPreventivo.set(null);
        this.pageMode.set('detail');

        this.isCreating.set(true);
        this.isEditing.set(true);

        const newId = Math.max(...this._preventivi().map(p => p.id)) + 1;

        this.formPreventivo.reset({
            id: newId,
            nomeCliente: '',
            dataPreventivo: '',
            importoTotale: 0
        });

        this.formPreventivo.enable();
        this.formPreventivo.controls['id'].disable();
    }

    // helper per accedere alle righe
    get righeFormArray(): FormArray { return this.formPreventivo.get('righe') as FormArray; }

    // metodo per creare una riga
    private createRiga(r: { descrizione: string; quantita: number }) {
        return this.fb.group({
            descrizione: [{ value: r.descrizione, disabled: true }, Validators.required],
            quantita: [{ value: r.quantita, disabled: true }, Validators.required]
        });
    }

}