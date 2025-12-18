import { Injectable } from "@angular/core";
import { ApiCrudService } from "../../shared/services/api-crud.service";
import { PreventivoModel } from "../models/preventivo-model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PdfApiService {
    private baseUrl: string = 'http://localhost:8088/preventivi';
    constructor(private http: HttpClient) { }

    getPdfPreventivo(id: number): Observable<Blob> {
        return this.http.get(
            `${this.baseUrl}/${id}/pdf`,
            { responseType: 'blob' }
        );
    }
}