import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreventiviService } from '../../services/preventivi.service';
import { PaginationService } from '../../../shared/pagination.service';
import { PreventivoModel } from '../../models/preventivo-model';



@Component({
    selector: 'app-preventivo-table',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './table.html',
    styleUrls: ['./table.css']
})
export class PreventivoTable {
    @Output() rowClick = new EventEmitter<any>();
    constructor(public service: PreventiviService, public svc: PaginationService<PreventivoModel>) {
        this.svc.setData(this.service.preventivi);
    }

    changeSort(col: string) { this.svc.changeSort(col); }
    open(p: any) { this.rowClick.emit(p); this.service.openDetails(p); }
}