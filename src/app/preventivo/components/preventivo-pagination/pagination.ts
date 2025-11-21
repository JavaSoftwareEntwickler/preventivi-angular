import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreventivoService } from '../../services/preventivo.service';


@Component({
    selector: 'app-preventivo-pagination',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pagination.html',
    styleUrls: ['./pagination.css']
})
export class PreventivoPagination {
    constructor(public svc: PreventivoService) { }


    prev() { this.svc.goToPage(this.svc.currentPage() - 1); }
    next() { this.svc.goToPage(this.svc.currentPage() + 1); }
}