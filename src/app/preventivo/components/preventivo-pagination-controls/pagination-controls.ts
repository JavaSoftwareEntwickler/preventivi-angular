import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicPaginationService } from '../../../shared/services/dynamic-pagination.service';
import { PreventivoModel } from '../../models/preventivo-model';
import { PreventivoManagementService } from '../../services/preventivo-managment.service';


@Component({
    selector: 'app-preventivo-pagination-controls',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pagination-controls.html',
    styleUrls: ['./pagination-controls.css']
})
export class PreventivoPaginationControlsComponent {
    constructor(
        public dataPagService: DynamicPaginationService<PreventivoModel>,
        private service: PreventivoManagementService
    ) {
        this.dataPagService.setData(this.service.preventivi);
    }
    prev() { this.dataPagService.goToPage(this.dataPagService.currentPage() - 1); }
    next() { this.dataPagService.goToPage(this.dataPagService.currentPage() + 1); }
}