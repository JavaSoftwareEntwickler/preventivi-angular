import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreventiviService } from '../../services/preventivi.service';


@Component({
    selector: 'app-preventivo-pagination',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pagination.html',
    styleUrls: ['./pagination.css']
})
export class PreventivoPagination {
    constructor(public svc: PreventiviService) { }


    prev() { this.svc.goToPage(this.svc.currentPage() - 1); }
    next() { this.svc.goToPage(this.svc.currentPage() + 1); }
}