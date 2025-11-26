import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreventivoList } from './components/preventivo-list/list';
import { PreventivoDetail } from './components/preventivo-detail/detail';
import { PreventiviService } from './services/preventivi.service';


@Component({
    selector: 'app-preventivo-page',
    standalone: true,
    imports: [CommonModule, PreventivoList, PreventivoDetail],
    templateUrl: './preventivo.page.html',
    styleUrls: ['./preventivo.page.css']
})
export class PreventivoPage {
    private svc = inject(PreventiviService);


    // esponiamo signals utili per il template se necessario
    pageMode = this.svc.pageMode;
    selected = this.svc.selectedPreventivo;


    openDetail(p: any) {
        this.svc.openDetails(p);
    }


    backToList() {
        this.svc.backToList();
    }
}