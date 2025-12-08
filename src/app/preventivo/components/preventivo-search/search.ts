import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicPaginationService } from '../../../shared/services/dynamic-pagination.service';
import { PreventivoModel } from '../../models/preventivo-model';
import { PreventivoManagementService } from '../../services/preventivo-managment.service';


@Component({
    selector: 'app-preventivo-search-bar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './search.html',
    styleUrls: ['./search.css']
})
export class PreventivoSearchComponent {
    constructor(public svc: DynamicPaginationService<PreventivoModel>, private service: PreventivoManagementService) {
        this.svc.setData(this.service.preventivi);
    }
}