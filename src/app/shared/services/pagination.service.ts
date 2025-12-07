import { computed, effect, Injectable, Signal, signal } from '@angular/core';

/**
 * Servizio di gestione della paginazione, ordinamento e ricerca.
 *
 * Responsabilità:
 * - Gestione di dati dinamici reattivi (Signal-based)
 * - Supporto a filtraggio testuale, ordinamento e paginazione
 * - Sincronizzazione automatica delle pagine quando i dati cambiano
 * - Interfaccia neutra generica: utilizzabile con qualsiasi tipo di modello
 *
 * @template T Tipo generico del modello dei dati
 */
@Injectable({ providedIn: 'root' })
export class PaginationService<T> {
    /** Term di ricerca reattivo */
    searchTerm = signal<string>('');

    /** Colonna corrente per ordinamento */
    sortColumn = signal<string>('id');

    /** Direzione dell'ordinamento: 'asc' | 'desc' */
    sortDirection = signal<'asc' | 'desc'>('asc');

    /** Dimensione pagina (numero di elementi per pagina) */
    pageSize = 5;

    /** Pagina corrente */
    currentPage = signal<number>(1);

    /** Dati interni reattivi */
    private _data = signal<T[]>([]);

    constructor() { }

    /**
     * Imposta il segnale esterno dei dati da cui la paginazione deve derivare.
     * Viene creato un effetto reattivo che aggiorna i dati interni
     * e resetta la pagina corrente quando i dati cambiano.
     *
     * @param dataSignal Signal esterno contenente l'array di dati
     */
    setData(dataSignal: Signal<T[]>) {
        effect(() => {
            this._data.set(dataSignal());
            this.currentPage.set(1); // reset page quando i dati cambiano
        });
    }

    /**
     * Imposta il segnale esterno dei dati da cui la paginazione deve derivare.
     * Viene creato un effetto reattivo che aggiorna i dati interni
     * e resetta la pagina corrente quando i dati cambiano.
     *
     * @param dataSignal Signal esterno contenente l'array di dati
     */
    setDataStatic(dataSignal: Signal<T[]>) {

        this._data.set(dataSignal());
        this.currentPage.set(1); // reset page quando i dati cambiano

    }

    /** Dati filtrati secondo il termine di ricerca */
    filtered = computed(() => {
        const q = this.searchTerm().toLowerCase();
        return this._data().filter((item: any) =>
            Object.values(item).some((v) => String(v).toLowerCase().includes(q)),
        );
    });

    /** Dati filtrati e ordinati secondo colonna e direzione */
    sorted = computed(() => {
        const col = this.sortColumn();
        const dir = this.sortDirection();
        return [...this.filtered()].sort((a: any, b: any) => {
            if (a[col] < b[col]) return dir === 'asc' ? -1 : 1;
            if (a[col] > b[col]) return dir === 'asc' ? 1 : -1;
            return 0;
        });
    });

    /** Dati filtrati, ordinati e paginati */
    paginated = computed(() => {
        const start = (this.currentPage() - 1) * this.pageSize;
        return this.sorted().slice(start, start + this.pageSize);
    });

    /** Numero totale di pagine calcolato dinamicamente */
    totalPages = computed(() => Math.max(1, Math.ceil(this.sorted().length / this.pageSize)));

    /**
     * Effetto interno per sincronizzare la pagina corrente
     * nel caso in cui il numero di pagine cambi a seguito di filtro o ordinamento.
     */
    private _sync = effect(() => {
        const tp = this.totalPages();
        if (this.currentPage() > tp) this.currentPage.set(tp);
    });

    // -------------------
    // API Pubbliche
    // -------------------

    /**
     * Aggiorna il termine di ricerca e resetta la pagina corrente
     * @param value Term di ricerca
     */
    setSearch(value: string) {
        this.searchTerm.set(value);
        this.currentPage.set(1);
    }

    /**
     * Aggiorna la colonna di ordinamento o ne inverte la direzione
     * se la colonna selezionata è già attiva
     * @param col Nome della colonna su cui ordinare
     */
    changeSort(col: string) {
        if (this.sortColumn() === col) {
            this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
        } else {
            this.sortColumn.set(col);
            this.sortDirection.set('asc');
        }
    }

    /**
     * Naviga a una pagina specifica se valida
     * @param page Numero di pagina (1-based)
     */
    goToPage(page: number) {
        if (page > 0 && page <= this.totalPages()) this.currentPage.set(page);
    }
}
