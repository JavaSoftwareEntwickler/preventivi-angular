import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreventivoListViewComponent } from './components/preventivo-list-view/list-view';
import { PreventivoDetailViewComponent } from './components/preventivo-detail-view/detail-view';
import { PreventivoManagementService } from './services/preventivo-managment.service';

@Component({
    selector: 'app-preventivo-container',
    standalone: true,
    imports: [CommonModule, PreventivoListViewComponent, PreventivoDetailViewComponent],
    templateUrl: './preventivo-container.html',
    styleUrls: ['./preventivo-container.css']
})
export class PreventivoContainerComponent {
    private service = inject(PreventivoManagementService);

    // esponiamo signals utili per il template se necessario
    pageMode = this.service.pageMode;
    selected = this.service.selectedPreventivo;

    openDetail(p: any) {
        this.service.openDetails(p);
    }

    backToList() {
        this.service.backToList();
    }
}