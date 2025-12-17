import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreventivoTableViewComponent } from '../preventivo-table-view/table';
import { PreventivoSearchComponent } from '../preventivo-search/search';
import { PreventivoPaginationControlsComponent } from '../preventivo-pagination-controls/pagination-controls';
import { PreventivoManagementService } from '../../services/preventivo-managment.service';


@Component({
    selector: 'app-preventivo-list-view',
    standalone: true,
    imports: [CommonModule, PreventivoSearchComponent, PreventivoTableViewComponent, PreventivoPaginationControlsComponent],
    templateUrl: './list-view.html',
    styleUrls: ['./list-view.css']
})
export class PreventivoListViewComponent {
    @Output() openDetail = new EventEmitter<any>();
    constructor(public service: PreventivoManagementService) { }

    nuovoPreventivo() { this.service.nuovoPreventivo().subscribe({}) }
    onRowClick(p: any) { this.openDetail.emit(p); }
}