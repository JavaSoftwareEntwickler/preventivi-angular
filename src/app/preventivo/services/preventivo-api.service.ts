import { Injectable } from "@angular/core";
import { ApiCrudService } from "../../shared/services/api-crud.service";
import { PreventivoModel } from "../models/preventivo-model";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class PreventivoApiService extends ApiCrudService<PreventivoModel> {
    constructor(http: HttpClient) {
        super(http);
        this.setApiUrl('http://localhost:8088/preventivi');
    }
}