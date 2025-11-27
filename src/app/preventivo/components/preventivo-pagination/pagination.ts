import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationService } from '../../../shared/services/pagination.service';
import { PreventivoModel } from '../../models/preventivo-model';
import { PreventiviService } from '../../services/preventivi.service';


@Component({
    selector: 'app-preventivo-pagination',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pagination.html',
    styleUrls: ['./pagination.css']
})
export class PreventivoPagination {
    constructor(public svc: PaginationService<PreventivoModel>, private service: PreventiviService) {
        this.svc.setData(this.service.preventivi);
    }
    prev() { this.svc.goToPage(this.svc.currentPage() - 1); }
    next() { this.svc.goToPage(this.svc.currentPage() + 1); }
}