import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreventivoTable } from '../preventivo-table/table';
import { PreventivoSearchBar } from '../preventivo-search-bar/search-bar';
import { PreventivoPagination } from '../preventivo-pagination/pagination';
import { PreventiviService } from '../../services/preventivi.service';


@Component({
    selector: 'app-preventivo-list',
    standalone: true,
    imports: [CommonModule, PreventivoTable, PreventivoSearchBar, PreventivoPagination],
    templateUrl: './list.html',
    styleUrls: ['./list.css']
})
export class PreventivoList {
    @Output() openDetail = new EventEmitter<any>();
    constructor(public svc: PreventiviService) { }


    nuovoPreventivo() { this.svc.nuovoPreventivo(); }
    onRowClick(p: any) { this.openDetail.emit(p); }
}