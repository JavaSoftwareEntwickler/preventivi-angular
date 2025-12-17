import { Injectable } from "@angular/core";
import { ApiCrudService } from "../../shared/services/api-crud.service";
import { HttpClient } from "@angular/common/http";
import { RighePreventivoModel } from "../models/righe-preventivo-model";

@Injectable({ providedIn: 'root' })
export class RighePreventivoApiService extends ApiCrudService<RighePreventivoModel> {
    constructor(http: HttpClient) {
        super(http);
        this.setApiUrl('http://localhost:8088/righe-preventivo');
    }
}