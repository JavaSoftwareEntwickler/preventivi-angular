import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreventivoManagementService } from '../../services/preventivo-managment.service';
import { DynamicPaginationService } from '../../../shared/services/dynamic-pagination.service';
import { PreventivoModel } from '../../models/preventivo-model';



@Component({
    selector: 'app-preventivo-table-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './table.html',
    styleUrls: ['./table.css']
})
export class PreventivoTableViewComponent {
    @Output() rowClick = new EventEmitter<any>();
    constructor(
        public service: PreventivoManagementService,
        public dataPaginationService: DynamicPaginationService<PreventivoModel>
    ) {
        this.dataPaginationService.setData(this.service.preventivi);
    }
    changeSort(col: string) { this.dataPaginationService.changeSort(col); }
    open(p: any) { this.rowClick.emit(p); }
}