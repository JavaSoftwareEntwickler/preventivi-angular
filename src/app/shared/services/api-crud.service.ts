import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Servizio generico per le operazioni CRUD (Create, Read, Update, Delete).
 * 
 * Questo servizio consente di eseguire operazioni di gestione per qualsiasi tipo di entità
 * definito tramite un tipo generico `T`. Può essere utilizzato per interagire con un'API RESTful
 * che espone le operazioni CRUD su un dato tipo di oggetto.
 * 
 * @template T Tipo dell'entità su cui eseguire le operazioni CRUD.
 */
@Injectable({
    providedIn: 'root',
})
export class ApiCrudService<T> {
    /**
     * URL base per le API, da configurare tramite il metodo `setApiUrl`.
     * 
     * @private
     */
    private apiUrl: string = "";

    /**
     * Opzioni HTTP, che includono gli header per il tipo di contenuto.
     * 
     * @private
     */
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };

    /**
     * Crea una nuova istanza di CrudService.
     * 
     * @param http Il client HTTP utilizzato per le richieste.
     */
    constructor(private http: HttpClient) { }

    /**
     * Imposta l'URL base per le operazioni CRUD.
     * Questo URL deve essere configurato per ogni tipo di entità.
     * 
     * @param url L'URL base per l'API su cui eseguire le operazioni.
     */
    setApiUrl(url: string): void {
        this.apiUrl = url;
    }

    /**
     * Crea un nuovo elemento nel backend.
     * 
     * Esegue una richiesta HTTP `POST` per creare un nuovo elemento nel sistema.
     * 
     * @param item L'oggetto di tipo `T` da creare.
     * @returns Un `Observable` che emette l'elemento creato.
     */
    create(item: T): Observable<T> {
        return this.http.post<{ status: string, data: T }>(`${this.apiUrl}`, item, this.httpOptions).pipe(
            map(response => response.data),  // Mappa i dati della risposta all'array di oggetti `T`
            catchError(this.handleError<T>('create'))
        );
    }

    /**
     * Ottiene un elenco di tutti gli elementi dal backend.
     * 
     * Esegue una richiesta HTTP `GET` per recuperare tutti gli elementi della risorsa.
     * 
     * @returns Un `Observable` che emette un array di elementi di tipo `T`.
     */
    getAll(): Observable<T[]> {
        return this.http.get<{ status: string, data: T[] }>(`${this.apiUrl}`).pipe(
            map(response => response.data),  // Mappa i dati della risposta all'array di oggetti `T`
            catchError(this.handleError<T[]>('getAll', []))
        );
    }

    /**
     * Ottiene un singolo elemento identificato da `id` dal backend.
     * 
     * Esegue una richiesta HTTP `GET` per recuperare l'elemento con l'ID specificato.
     * 
     * @param id L'ID dell'elemento da recuperare.
     * @returns Un `Observable` che emette l'elemento di tipo `T` con l'ID fornito.
     */
    getById(id: number): Observable<T> {
        return this.http.get<{ status: string, data: T }>(`${this.apiUrl}/${id}`).pipe(
            map(response => response.data),  // Mappa i dati della risposta all'array di oggetti `T`
            catchError(this.handleError<T>('getById'))
        );
    }

    /**
     * Aggiorna un elemento nel backend.
     * 
     * Esegue una richiesta HTTP `PUT` per aggiornare un elemento esistente con l'ID specificato.
     * 
     * @param id L'ID dell'elemento da aggiornare.
     * @param item L'oggetto di tipo `T` che contiene i dati aggiornati.
     * @returns Un `Observable` che emette l'elemento aggiornato.
     */
    update(id: number, item: T): Observable<T> {
        return this.http.put<{ status: string, data: T }>(`${this.apiUrl}/${id}`, item, this.httpOptions).pipe(
            map(response => response.data),  // Mappa i dati della risposta all'array di oggetti `T`
            catchError(this.handleError<T>('update'))
        );
    }

    /**
     * Elimina un elemento dal backend.
     * 
     * Esegue una richiesta HTTP `DELETE` per eliminare un elemento identificato dall'ID fornito.
     * 
     * @param id L'ID dell'elemento da eliminare.
     * @returns Un `Observable` che emette l'elemento eliminato.
     */
    delete(id: number): Observable<T> {
        return this.http.delete<{ status: string, data: T }>(`${this.apiUrl}/${id}`).pipe(
            map(response => response.data),  // Mappa i dati della risposta all'array di oggetti `T`
            catchError(this.handleError<T>('delete'))
        );
    }

    /**
     * Gestisce gli errori generici per le operazioni HTTP.
     * 
     * Viene utilizzato per catturare eventuali errori nelle operazioni CRUD
     * e loggare l'errore nella console. Inoltre restituisce un valore vuoto
     * nel caso di errore per evitare interruzioni nell'esecuzione dell'applicazione.
     * 
     * @private
     * @param operation Il nome dell'operazione che ha generato l'errore (ad esempio, 'create', 'getAll', ecc.).
     * @param result Il valore di ritorno predefinito in caso di errore, di tipo `T`.
     * @returns Un `Observable` che emette il valore di fallback in caso di errore.
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(`${operation} failed: ${error.message}`);
            // Iniettiamo un valore vuoto nel caso di errore
            return of(result as T);
        };
    }
}
