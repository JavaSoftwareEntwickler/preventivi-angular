import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreventiviService } from '../../services/preventivi.service';



@Component({
    selector: 'app-preventivo-table',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './table.html',
    styleUrls: ['./table.css']
})
export class PreventivoTable {
    @Output() rowClick = new EventEmitter<any>();
    constructor(public svc: PreventiviService) { }


    changeSort(col: string) { this.svc.changeSort(col); }
    open(p: any) { this.rowClick.emit(p); this.svc.openDetails(p); }
}